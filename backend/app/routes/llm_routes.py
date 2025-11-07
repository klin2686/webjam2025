from flask import Blueprint, jsonify, request
from google import genai
from google.genai import types
from PIL import Image, ImageOps, ImageEnhance
import pillow_heif
import io
import json
from sqlalchemy import select
from app.models import STANDARD_ALLERGENS, MenuUpload
from app.extensions import db
from app.utils.jwt_utils import token_required

pillow_heif.register_heif_opener()

llm_bp = Blueprint('llm', __name__)


def preprocess_image(image_file, max_size=1536, enhance=True):
    """Preprocess and optimize image for Gemini processing"""
    img = Image.open(image_file)

    if img.mode != 'RGB':
        img = img.convert('RGB')

    try:
        img = ImageOps.exif_transpose(img)
    except Exception:
        pass

    if max(img.size) > max_size:
        img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

    if enhance:
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.2)

        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(1.3)

    return img


def image_to_bytes(img, format='JPEG', quality=75):
    """Convert PIL Image to bytes for API transmission"""
    buffer = io.BytesIO()
    try:
        img.save(buffer, format=format, quality=quality, optimize=True)
        buffer.seek(0)
        return buffer.getvalue()
    finally:
        buffer.close()


# Gemini prompts
gemini_image_prompt = (
    'Extract all food items from this menu image. For each item, identify common allergens '
    'from this set (spelled and capitalized as shown in the set): ' + str(STANDARD_ALLERGENS) + '. '
    'Use "None" if no common allergens are present and "Unknown" if uncertain from the name alone. '
    'Also for each item, include a confidence score from 1 to 10 (inclusive) on how confident you are in the listed allergens for that item. '
    'If any item is labeled as unknown, the confidence score should be zero. '
    'If the menu is unreadable (cannot accurately extract 90+% of the items), return a single object array with "__ERROR__" in all properties.'
)
gemini_text_prompt = (
    'Here is a list of menu items: {menu_items}. For each item, identify common allergens '
    'from this set (spelled and capitalized as shown in the set): {{' + ', '.join(STANDARD_ALLERGENS) + '}}. '
    'Use "None" if no common allergens are present and "Unknown" if uncertain from the name alone. '
    'Also for each item, include a confidence score from 1 to 10 (inclusive) on how confident you are in the listed allergens for that item. '
    'If any item is labeled as unknown, the confidence score should be zero. '
    'If more than 10% of the menu items are not food items, return a single object array with "__ERROR__" in all properties. Otherwise, '
    'just set the common allergens to "Unknown" for the odd items.'
)


# Gemini structured output schemas
menu_item_schema = types.Schema(
    type=types.Type.OBJECT,
    properties={
        'item_name': types.Schema(
            type=types.Type.STRING,
            description='Name of the menu item'
        ),
        'common_allergens': types.Schema(
            type=types.Type.ARRAY,
            items=types.Schema(type=types.Type.STRING),
            description='List of common allergens found in this food item'
        ),
        'confidence_score': types.Schema(
            type=types.Type.INTEGER,
            description='Confidence in the listed allergens for this food item'
        )
    },
    required=['item_name', 'common_allergens', 'confidence_score']
)
response_schema = types.Schema(
    type=types.Type.ARRAY,
    items=menu_item_schema
)


@llm_bp.route('/process-menu', methods=['POST'])
@token_required
def process_menu(current_user):
    """Process uploaded menu image and extract items with allergens using Gemini"""
    if 'menu_image' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    image_file = request.files['menu_image']

    upload_name = image_file.filename or 'Untitled Menu'

    if image_file.filename is not None:
        file_name = image_file.filename.lower()
    else:
        return jsonify({'error': 'Invalid file: filename is missing'}), 400
    allowed_ext = ('.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp')
    if not file_name.endswith(allowed_ext):
        return jsonify({'error': 'Unsupported file type'}), 400

    processed_image = None
    try:
        processed_image = preprocess_image(image_file)
        image_bytes = image_to_bytes(processed_image)
    except Exception as e:
        return jsonify({'error': f'Image processing failed: {str(e)}'}), 500
    finally:
        if processed_image is not None:
            processed_image.close()

    client = genai.Client()
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
            gemini_image_prompt,
            types.Part.from_bytes(
                data=image_bytes,
                mime_type='image/jpeg',
            )
        ],
        config={
            'response_mime_type': 'application/json',
            'response_schema': response_schema,
            'temperature': 0
        },
    )

    if response.text:
        parsed_data = json.loads(response.text)

        if parsed_data and len(parsed_data) > 0 and parsed_data[0].get('item_name') == '__ERROR__':
            return jsonify({'error': 'Menu image is too blurry or unreadable'}), 400

        try:
            menu_upload = MenuUpload(
                user_id=current_user.id,
                upload_name=upload_name.strip(),
                analysis_result=parsed_data
            )
            db.session.add(menu_upload)
            db.session.commit()
            return jsonify(parsed_data), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to save menu upload: {str(e)}'}), 500

    else:
        return jsonify({'error': 'No response from Gemini'}), 500


@llm_bp.route('/process-manual-input', methods=['POST'])
@token_required
def process_manual(current_user):
    """Parse and send a list of menu items to Gemini for processing"""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No json body provided'}), 400

    menu_items = data.get('menu_items')
    if not menu_items:
        return jsonify({'error': 'No menu_items field was was provided'}), 400
    if not isinstance(menu_items, list):
        return jsonify({'error': 'menu_items must contain a list'}), 400
    stripped_menu_items = [item.strip() for item in menu_items if isinstance(item, str)]
    if len(menu_items) != len(stripped_menu_items):
        return jsonify({'error': 'Menu items must be strings'}), 400

    upload_name = data.get('menu_name', 'Untitled Manual Menu Input')
    if upload_name.strip() == '':
        upload_name = 'Untitled Manual Menu Input'

    client = genai.Client()
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=gemini_text_prompt.format(menu_items=', '.join(stripped_menu_items)),
        config={
            'response_mime_type': 'application/json',
            'response_schema': response_schema,
            'temperature': 0
        },
    )

    if response.text:
        parsed_data = json.loads(response.text)
        if parsed_data and len(parsed_data) > 0 and parsed_data[0].get('item_name') == '__ERROR__':
            return jsonify({'error': 'Invalid menu items'}), 400

        try:
            menu_upload = MenuUpload(
                user_id=current_user.id,
                upload_name=upload_name.strip(),
                analysis_result=parsed_data
            )
            db.session.add(menu_upload)
            db.session.commit()
            return jsonify(parsed_data), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to save menu upload: {str(e)}'}), 500

    else:
        return jsonify({'error': 'No response from Gemini'}), 500


@llm_bp.route('/menu-uploads', methods=['GET'])
@token_required
def get_menu_uploads(current_user):
    """Get all menu uploads for the authenticated user with optional limit"""
    limit = request.args.get('limit', type=int)

    try:
        stmt = select(MenuUpload).filter_by(user_id=current_user.id).order_by(MenuUpload.created_at.desc())

        if limit is not None and limit > 0:
            stmt = stmt.limit(limit)

        uploads = db.session.scalars(stmt).all()

        return jsonify([upload.to_dict() for upload in uploads]), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve menu uploads: {str(e)}'}), 500


@llm_bp.route('/menu-uploads/<int:upload_id>', methods=['GET'])
@token_required
def get_menu_upload(current_user, upload_id):
    """Get a specific menu upload by ID"""
    try:
        stmt = select(MenuUpload).filter_by(id=upload_id, user_id=current_user.id)
        upload = db.session.execute(stmt).scalar_one_or_none()

        if not upload:
            return jsonify({'error': 'Menu upload not found'}), 404

        return jsonify(upload.to_dict()), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve menu upload: {str(e)}'}), 500


@llm_bp.route('/menu-uploads/<int:upload_id>', methods=['PUT'])
@token_required
def rename_menu_upload(current_user, upload_id):
    """Rename a menu upload"""
    data = request.get_json()

    if not data or not data.get('upload_name'):
        return jsonify({'error': 'upload_name is required'}), 400

    new_name = data['upload_name'].strip()
    if not new_name:
        return jsonify({'error': 'upload_name cannot be empty'}), 400

    try:
        stmt = select(MenuUpload).filter_by(id=upload_id, user_id=current_user.id)
        upload = db.session.execute(stmt).scalar_one_or_none()

        if not upload:
            return jsonify({'error': 'Menu upload not found'}), 404

        upload.upload_name = new_name
        db.session.commit()

        return jsonify(upload.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to rename menu upload: {str(e)}'}), 500


@llm_bp.route('/menu-uploads/<int:upload_id>', methods=['DELETE'])
@token_required
def delete_menu_upload(current_user, upload_id):
    """Delete a menu upload"""
    try:
        stmt = select(MenuUpload).filter_by(id=upload_id, user_id=current_user.id)
        upload = db.session.execute(stmt).scalar_one_or_none()

        if not upload:
            return jsonify({'error': 'Menu upload not found'}), 404

        db.session.delete(upload)
        db.session.commit()

        return jsonify({'message': 'Menu upload deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete menu upload: {str(e)}'}), 500