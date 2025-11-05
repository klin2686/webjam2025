from flask import Blueprint, request, jsonify
from sqlalchemy import select
from app.utils.validators import validate_email_address, validate_password_strength
from app.extensions import db
from app.models import User
from app.utils.jwt_utils import (
    generate_access_token, 
    generate_refresh_token, 
    decode_token,
    token_required
)
from app.utils.google_oauth import verify_google_token

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """Register new user with email/password"""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    email = data['email'].strip()
    password = data['password']
    name = data.get('name', '').strip()

    is_valid, normalized_email, email_error = validate_email_address(email)
    if not is_valid:
        return jsonify({'error': f'Invalid email: {email_error}'}), 400

    is_valid_password, password_error = validate_password_strength(password)
    if not is_valid_password:
        return jsonify({'error': password_error}), 400

    stmt = select(User).where(User.email == normalized_email)
    existing_user = db.session.execute(stmt).scalar_one_or_none()

    if existing_user:
        return jsonify({'error': 'Email already registered'}), 409

    user = User(
        email=normalized_email,
        name=name if name else None,
        email_verified=False
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    access_token = generate_access_token(user.id)
    refresh_token = generate_refresh_token(user.id)

    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 201


@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Login with email/password"""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    email = data['email'].strip()
    password = data['password']

    is_valid, normalized_email, email_error = validate_email_address(email)
    if not is_valid:
        return jsonify({'error': 'Invalid email or password'}), 401

    stmt = select(User).where(User.email == normalized_email)
    user = db.session.execute(stmt).scalar_one_or_none()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = generate_access_token(user.id)
    refresh_token = generate_refresh_token(user.id)

    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200


@auth_bp.route('/auth/google', methods=['POST'])
def google_auth():
    """Authenticate or register user with Google OAuth"""
    data = request.get_json()

    if not data or not data.get('token'):
        return jsonify({'error': 'Google token is required'}), 400

    google_user_info = verify_google_token(data['token'])

    if not google_user_info:
        return jsonify({'error': 'Invalid Google token'}), 401

    stmt = select(User).where(User.google_id == google_user_info['google_id'])
    user = db.session.execute(stmt).scalar_one_or_none()

    # existing google user
    if user:
        user.name = google_user_info.get('name') or user.name
        user.profile_picture = google_user_info.get('picture') or user.profile_picture
        db.session.commit()

        access_token = generate_access_token(user.id)
        refresh_token = generate_refresh_token(user.id)

        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200

    email = google_user_info['email'].lower()
    stmt = select(User).where(User.email == email)
    user = db.session.execute(stmt).scalar_one_or_none()

    # existing email/password user without google link yet
    if user:
        user.google_id = google_user_info['google_id']
        user.email_verified = True
        user.profile_picture = google_user_info.get('picture') or user.profile_picture
        if not user.name:
            user.name = google_user_info.get('name')
        db.session.commit()

        access_token = generate_access_token(user.id)
        refresh_token = generate_refresh_token(user.id)

        return jsonify({
            'message': 'Google account linked successfully',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200

    # new user
    user = User(
        email=email,
        google_id=google_user_info['google_id'],
        name=google_user_info.get('name'),
        profile_picture=google_user_info.get('picture'),
        email_verified=True
    )

    db.session.add(user)
    db.session.commit()

    access_token = generate_access_token(user.id)
    refresh_token = generate_refresh_token(user.id)

    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 201


@auth_bp.route('/auth/refresh', methods=['POST'])
def refresh():
    """Refresh access token using refresh token"""
    data = request.get_json()

    if not data or not data.get('refresh_token'):
        return jsonify({'error': 'Refresh token is required'}), 400

    payload = decode_token(data['refresh_token'])

    if not payload or payload.get('type') != 'refresh':
        return jsonify({'error': 'Invalid refresh token'}), 401

    user = db.session.get(User, payload['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 401

    access_token = generate_access_token(user.id)

    return jsonify({
        'access_token': access_token
    }), 200


@auth_bp.route('/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current user info from token"""
    return jsonify({
        'user': current_user.to_dict()
    }), 200


@auth_bp.route('/auth/update-profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Update user profile"""
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'name' in data:
        current_user.name = data['name'].strip() if data['name'] else None

    if 'profile_picture' in data:
        current_user.profile_picture = data['profile_picture'].strip() if data['profile_picture'] else None

    db.session.commit()

    return jsonify({
        'message': 'Profile updated successfully',
        'user': current_user.to_dict()
    }), 200


@auth_bp.route('/auth/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    """Change user password"""
    data = request.get_json()

    if not data or not data.get('current_password') or not data.get('new_password'):
        return jsonify({'error': 'Current password and new password are required'}), 400

    if not current_user.password_hash:
        return jsonify({'error': 'Cannot change password for OAuth-only accounts'}), 400

    if not current_user.check_password(data['current_password']):
        return jsonify({'error': 'Current password is incorrect'}), 401

    is_valid, password_error = validate_password_strength(data['new_password'])
    if not is_valid:
        return jsonify({'error': password_error}), 400

    current_user.set_password(data['new_password'])
    db.session.commit()

    return jsonify({
        'message': 'Password changed successfully'
    }), 200