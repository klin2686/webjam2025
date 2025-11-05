from flask import Blueprint, jsonify, request
from google import genai
from google.genai import types
from PIL import Image, ImageOps, ImageEnhance
import pillow_heif
import io
import json

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
            types.Part.from_bytes(
                data=image_bytes,
                mime_type='image/jpeg',
            ),
            gemini_prompt
        ],
        config={
            "response_mime_type": "application/json",
            "response_schema": response_schema,
        },
    )

    if response.text:
        parsed_data = json.loads(response.text)
        if parsed_data and len(parsed_data) > 0 and parsed_data[0].get("item_name") == "__ERROR__":
            return jsonify({"error": "Menu image is too blurry or unreadable"}), 400
        return jsonify(parsed_data)
    else:
        return jsonify({"error": "No response from Gemini"}), 500


def preprocess_image(image_file, max_size=2048, enhance=True):
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


def image_to_bytes(img, format='JPEG', quality=95):
    """Convert PIL Image to bytes for API transmission"""
    buffer = io.BytesIO()
    try:
        img.save(buffer, format=format, quality=quality)
        buffer.seek(0)
        return buffer.getvalue()
    finally:
        buffer.close()


# Gemini prompt
gemini_prompt = (
    'Please itemize the food items on the image of a menu. '
    'Then, for each item, identify allergens commonly found '
    'in that food item (or something similar). If an item does '
    'not have any common allergens, its common_allergens property '
    'should hold a single string "None". If the menu '
    'is blurry or unreadable where it is difficult to accurately '
    'itemize 90% of the menu items, then return a JSON array '
    'with a single object holding "__ERROR__" in both properties.'
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
    },
    required=["item_name", "common_allergens"]
)
response_schema = types.Schema(
    type=types.Type.ARRAY,
    items=menu_item_schema
)