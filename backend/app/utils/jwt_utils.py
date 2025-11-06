from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import jwt
from flask import current_app, request
from functools import wraps
from app.models import User
from app.extensions import db


def generate_access_token(user_id: int) -> str:
    """Generate JWT access token"""
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=48),
        'iat': datetime.now(timezone.utc),
        'type': 'access'
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')


def generate_refresh_token(user_id: int) -> str:
    """Generate JWT refresh token"""
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=30),
        'iat': datetime.now(timezone.utc),
        'type': 'refresh'
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and verify JWT token"""
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_token_from_header() -> Optional[str]:
    """Extract token from Authorization header"""
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]
    return None


def token_required(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_header()

        if not token:
            return {'error': 'Token is missing'}, 401

        payload = decode_token(token)
        if not payload:
            return {'error': 'Token is invalid or expired'}, 401

        if payload.get('type') != 'access':
            return {'error': 'Invalid token type'}, 401

        user = db.session.get(User, payload['user_id'])
        if not user:
            return {'error': 'User not found'}, 401

        return f(current_user=user, *args, **kwargs)

    return decorated


def token_optional(f):
    """Decorator to optionally get user from token if present"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_header()
        current_user = None

        if token:
            payload = decode_token(token)
            if payload and payload.get('type') == 'access':
                current_user = db.session.get(User, payload['user_id'])

        return f(current_user=current_user, *args, **kwargs)

    return decorated