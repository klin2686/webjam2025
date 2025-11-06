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


@llm_bp.route('/process-menu', methods=['POST'])
def process_menu():
    """Process uploaded menu image and extract items with allergens using Gemini"""
    if "menu_image" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    image_file = request.files["menu_image"]

    if image_file.filename is not None:
        file_name = image_file.filename.lower()
    else:
        return jsonify({"error": "Invalid file: filename is missing"}), 400
    allowed_ext = (".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp")
    if not file_name.endswith(allowed_ext):
        return jsonify({"error": "Unsupported file type"}), 400

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
        model="gemini-2.5-flash",
        contents=[
            gemini_prompt,
            types.Part.from_bytes(
                data=image_bytes,
                mime_type='image/jpeg',
            )
        ],
        config={
            "response_mime_type": "application/json",
            "response_schema": response_schema,
            "temperature": 0
        },
    )

    if response.text:
        parsed_data = json.loads(response.text)
        if parsed_data and len(parsed_data) > 0 and parsed_data[0].get("item_name") == "__ERROR__":
            return jsonify({"error": "Menu image is too blurry or unreadable"}), 400
        return jsonify(parsed_data)
    else:
        return jsonify({"error": "No response from Gemini"}), 500


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


# Gemini prompt
gemini_prompt = (
    'Extract all food items from this menu image. For each item, identify common allergens '
    'from this set (spelled and capitalized as shown in the set): ' + str(STANDARD_ALLERGENS) + '. '
    'Use "None" if no common allergens are present and "Unknown" if uncertain from the name alone. '
    'Also for each item, include a confidence score from 1 to 10 (inclusive) on how confident you are in the listed allergens for that item. '
    'If the menu is unreadable (cannot accurately extract 90+% of the items), return a single object array with "__ERROR__" in all properties.'
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
    required=["item_name", "common_allergens", "confidence_score"]
)
response_schema = types.Schema(
    type=types.Type.ARRAY,
    items=menu_item_schema
)

@llm_bp.route('/manual_input', methods = ['POST'])
def process_manual():
    data = request.get_json()

    food = data.get('manual_input')
    if not food:
        return jsonify({'error': 'Food was not given'}), 400
    try:
        food = str(data.get('manual_input'))
    except:
        return jsonify({'error': 'Food must be a string'}), 400
    
    client = genai.Client()
    response = client.models.generate_content(
        model = "gemini-2.5-flash",
        contents = f'for {food} please itemize the list of ingredients. {gemini_prompt[54:619]}',
        config={
            "response_mime_type": "application/json",
            "response_schema": response_schema,
        },
        )
    if response.text:
        parsed_data = json.loads(response.text)
        
        return jsonify(parsed_data)
    else:
        return jsonify({"error": "No response from Gemini"}), 500