from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models.category import Category
from app.utils.admin_required import admin_required

category_bp = Blueprint("categories", __name__)


@category_bp.route("", methods=["GET"])
def get_categories():
    categories = Category.query.order_by(Category.name.asc()).all()

    return jsonify({
        "categories": [category.to_dict() for category in categories]
    }), 200


@category_bp.route("", methods=["POST"])
@admin_required
def create_category():
    data = request.get_json()

    name = data.get("name")
    description = data.get("description")

    if not name:
        return jsonify({"message": "El nombre de la categoría es obligatorio"}), 400

    existing_category = Category.query.filter_by(name=name).first()

    if existing_category:
        return jsonify({"message": "La categoría ya existe"}), 409

    category = Category(
        name=name,
        description=description
    )

    db.session.add(category)
    db.session.commit()

    return jsonify({
        "message": "Categoría creada correctamente",
        "category": category.to_dict()
    }), 201


@category_bp.route("/<int:category_id>", methods=["PUT"])
@admin_required
def update_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({"message": "Categoría no encontrada"}), 404

    data = request.get_json()

    name = data.get("name")
    description = data.get("description")

    if name:
        existing_category = Category.query.filter(
            Category.name == name,
            Category.id != category_id
        ).first()

        if existing_category:
            return jsonify({"message": "Ya existe otra categoría con ese nombre"}), 409

        category.name = name

    if description is not None:
        category.description = description

    db.session.commit()

    return jsonify({
        "message": "Categoría actualizada correctamente",
        "category": category.to_dict()
    }), 200


@category_bp.route("/<int:category_id>", methods=["DELETE"])
@admin_required
def delete_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({"message": "Categoría no encontrada"}), 404

    if category.games:
        return jsonify({
            "message": "No puedes eliminar una categoría que tiene juegos asociados"
        }), 400

    db.session.delete(category)
    db.session.commit()

    return jsonify({
        "message": "Categoría eliminada correctamente"
    }), 200