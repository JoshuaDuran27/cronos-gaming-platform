from flask import Flask
from app.config import Config
from app.extensions import db, migrate, cors, jwt


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    jwt.init_app(app)

    from app import models

    from app.routes.auth_routes import auth_bp
    from app.routes.game_routes import game_bp
    from app.routes.category_routes import category_bp
    from app.routes.cart_routes import cart_bp
    from app.routes.checkout_routes import checkout_bp
    from app.routes.library_routes import library_bp
    from app.routes.review_routes import review_bp
    from app.main import register_main_routes
    from app.models.wishlist import Wishlist
    from app.routes.wishlist_routes import wishlist_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(game_bp, url_prefix="/api/games")
    app.register_blueprint(category_bp, url_prefix="/api/categories")
    app.register_blueprint(cart_bp, url_prefix="/api/cart")
    app.register_blueprint(checkout_bp, url_prefix="/api/checkout")
    app.register_blueprint(library_bp, url_prefix="/api/library")
    app.register_blueprint(review_bp, url_prefix="/api")
    app.register_blueprint(wishlist_bp, url_prefix="/api/wishlist")
    
    register_main_routes(app)

    return app