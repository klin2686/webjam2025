from app.routes.health_routes import health_bp
from app.routes.llm_routes import llm_bp
from app.routes.auth_routes import auth_bp


def register_blueprints(app):
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(llm_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')