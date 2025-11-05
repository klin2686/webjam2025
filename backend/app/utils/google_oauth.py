from typing import Optional, Dict, Any
import requests
from flask import current_app


def verify_google_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify Google OAuth token and return user info"""
    try:
        # Verify token with Google
        response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {token}'},
            timeout=10
        )

        if response.status_code != 200:
            return None

        user_info = response.json()

        # Validate required fields
        if 'sub' not in user_info or 'email' not in user_info:
            return None

        return {
            'google_id': user_info['sub'],
            'email': user_info['email'],
            'name': user_info.get('name'),
            'picture': user_info.get('picture')
        }

    except Exception as e:
        current_app.logger.error(f"Google token verification failed: {str(e)}")
        return None


def get_google_oauth_url() -> str:
    """Generate Google OAuth authorization URL"""
    client_id = current_app.config.get('GOOGLE_CLIENT_ID')
    redirect_uri = current_app.config.get('GOOGLE_REDIRECT_URI')

    base_url = 'https://accounts.google.com/o/oauth2/v2/auth'
    params = {
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'openid email profile',
        'access_type': 'offline',
        'prompt': 'consent'
    }

    query_string = '&'.join([f'{k}={v}' for k, v in params.items()])
    return f'{base_url}?{query_string}'