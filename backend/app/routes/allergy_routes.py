from flask import Blueprint, jsonify, request
from sqlalchemy import select
from app.extensions import db
from app.utils.jwt_utils import token_required
from app.models import UserAllergy, Allergen, STANDARD_ALLERGENS

allergy_bp = Blueprint('allergy',__name__)


@allergy_bp.route('/allergy/get', methods=['GET'])
@token_required
def get_allergy(current_user):
    """Retrieve all allergies for the current user"""
    stmt = select(UserAllergy).where(UserAllergy.user_id == current_user.id).order_by(UserAllergy.severity.desc())
    user_allergies = db.session.scalars(stmt).all()
    return jsonify({
        'message': 'Allergies retrieved successfully',
        'user_allergy': [user_allergy.to_dict() for user_allergy in user_allergies]
    }), 200

@allergy_bp.route('/allergy/add', methods=['POST'])
@token_required
def add_allergy(current_user):
    """Add a new allergy for the current user"""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No json body provided'}), 400

    allergen_name = data.get('allergen_name')
    if isinstance(allergen_name, str):
        allergen_name = allergen_name.strip().lower()
    else:
        return jsonify({'error': 'allergen_name must be a string'}), 400
    if not allergen_name:
        return jsonify({'error': 'No allergen_name provided'}), 400
    if allergen_name not in STANDARD_ALLERGENS:
        return jsonify({'error': 'Invalid allergen_name'}), 400

    try:
        food_severity = int(data.get('severity'))
    except ValueError:
        return jsonify({'error': 'Invalid allergy severity'}), 400
    except TypeError:
        return jsonify({'error': 'No severity provided'}), 400
    if not 1 <= food_severity <= 3:
        return jsonify({'error': 'Invalid allergy severity'}), 400

    stmt = select(Allergen).where(Allergen.name == allergen_name)
    allergen = db.session.execute(stmt).scalar_one_or_none()
    if not allergen:
        return jsonify({'error': 'Allergen not found'}), 404

    stmt = select(UserAllergy).where(UserAllergy.user_id == current_user.id).where(UserAllergy.allergen_id == allergen.id)
    user_allergy = db.session.execute(stmt).scalar_one_or_none()
    if user_allergy:
        return jsonify({'error': 'User allergy already exists'}), 400

    new_user_allergy = UserAllergy(user_id=current_user.id, allergen_id=allergen.id, severity=food_severity)
    db.session.add(new_user_allergy)
    db.session.commit()
    return jsonify({
        'message': 'Allergy created successfully',
        'user_allergy': new_user_allergy.to_dict()
    }), 201


@allergy_bp.route('/allergy/update', methods=['PUT'])
@token_required
def update_allergy(current_user):
    """Update the severity of an existing allergy"""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No json body provided'}), 400

    user_allergy_id = data.get('user_allergy_id')
    if not user_allergy_id:
        return jsonify({'error': 'No user_allergy_id provided'}), 400
    try:
        user_allergy_id = int(user_allergy_id)
    except ValueError:
        return jsonify({'error': 'user_allergy_id must be an int'}), 400

    severity = data.get('severity')
    if not severity:
        return jsonify({'error': 'No severity provided'}), 400
    try:
        severity = int(severity)
    except ValueError:
        return jsonify({'error': 'Severity must be an int'}), 400
    if not 1 <= severity <= 3:
        return jsonify({'error': 'Severity must be between 1 and 3; 1 for mild and 3 for severe'}), 400

    user_allergy = db.session.get(UserAllergy, user_allergy_id)

    if not user_allergy:
        return jsonify({'error': 'User allergy not found'}), 400

    if user_allergy.user_id != current_user.id:
        return jsonify({'error': 'Current user does not own the given user allergy'}), 401

    user_allergy.severity = severity
    db.session.commit()
    return jsonify({
        'message': 'User allergy severity updated successfully',
        'user_allergy': user_allergy.to_dict()
    }), 200


@allergy_bp.route('/allergy/delete', methods=['DELETE'])
@token_required
def delete_allergy(current_user):
    """Delete an allergy for the current user"""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No json body provided'}), 400

    user_allergy_id = data.get('user_allergy_id')
    if not user_allergy_id:
        return jsonify({'error': 'No user_allergy_id provided'}), 400
    try:
        user_allergy_id = int(user_allergy_id)
    except ValueError:
        return jsonify({'error': 'user_allergy_id must be an int'}), 400

    user_allergy = db.session.get(UserAllergy, user_allergy_id)

    if not user_allergy:
        return jsonify({'error': 'User_allergy association not found'}), 404

    if user_allergy.user_id != current_user.id:
        return jsonify({'error': 'Current user does not own the given user_allergy'}), 401

    db.session.delete(user_allergy)
    db.session.commit()
    return '', 204