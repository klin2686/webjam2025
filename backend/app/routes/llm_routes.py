from flask import Blueprint, jsonify, request
from google import genai
from google.genai import types
from PIL import Image, ImageOps, ImageEnhance
import pillow_heif
import io
import json
from app.models import STANDARD_ALLERGENS

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
def process_menu():
    """Process uploaded menu image and extract items with allergens using Gemini"""
    if 'menu_image' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    image_file = request.files['menu_image']

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
        return jsonify(parsed_data), 200
    else:
        return jsonify({'error': 'No response from Gemini'}), 500


@llm_bp.route('/process-manual-input', methods=['POST'])
def process_manual():
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
            return jsonify({'error': 'Invalid menu items (use generic names for specialty dishes)'}), 400
        return jsonify(parsed_data), 200
    else:
        return jsonify({'error': 'No response from Gemini'}), 500