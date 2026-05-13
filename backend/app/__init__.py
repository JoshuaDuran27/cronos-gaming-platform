from flask import Flask
from app.config import Config
from app.extensions import db, migrate, cors


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)

    from app.routes.auth_routes import auth_bp
    from app.main import register_main_routes

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    register_main_routes(app)

    return app