from flask import Blueprint, jsonify

from app.models.category import Category

category_bp = Blueprint("categories", __name__)


@category_bp.route("", methods=["GET"])
def get_categories():
    categories = Category.query.order_by(Category.name.asc()).all()

    return jsonify({
        "categories": [category.to_dict() for category in categories]
    }), 200