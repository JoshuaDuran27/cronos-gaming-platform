from flask import Flask
from app.config import Config
from app.extensions import db, migrate, cors


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)

    from app import models

    from app.routes.auth_routes import auth_bp
    from app.routes.game_routes import game_bp
    from app.routes.category_routes import category_bp
    from app.main import register_main_routes

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(game_bp, url_prefix="/api/games")
    app.register_blueprint(category_bp, url_prefix="/api/categories")

    register_main_routes(app)

    return app