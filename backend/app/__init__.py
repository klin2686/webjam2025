import os

from flask import Flask

from app.config import config
from app.extensions import cors, db


def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    os.makedirs(config[config_name].INSTANCE_PATH, exist_ok=True)

    db.init_app(app)

    cors_origins = app.config['CORS_ORIGINS']
    if cors_origins == '*':
        cors.init_app(app, supports_credentials=True)
    else:
        origins_list = [origin.strip() for origin in cors_origins.split(',')]
        cors.init_app(
            app,
            resources={r'/api/*': {
                'origins': origins_list,
                'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                'allow_headers': ['Content-Type', 'Authorization'],
                'expose_headers': ['Content-Type'],
                'supports_credentials': True
            }}
        )

    from app.routes import register_blueprints

    register_blueprints(app)

    with app.app_context():
        db.create_all()

    return app
