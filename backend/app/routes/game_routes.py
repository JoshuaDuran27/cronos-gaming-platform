from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models.game import Game
from app.models.category import Category
from app.utils.admin_required import admin_required

game_bp = Blueprint("games", __name__)


@game_bp.route("", methods=["GET"])
def get_games():
    category_id = request.args.get("categoryId", type=int)
    search = request.args.get("search", type=str)

    query = Game.query

    if category_id:
        query = query.filter_by(category_id=category_id)

    if search:
        query = query.filter(Game.title.ilike(f"%{search}%"))

    games = query.order_by(Game.id.asc()).all()

    return jsonify({
        "games": [game.to_dict() for game in games]
    }), 200


@game_bp.route("/<int:game_id>", methods=["GET"])
def get_game_by_id(game_id):
    game = Game.query.get(game_id)

    if not game:
        return jsonify({"message": "Juego no encontrado"}), 404

    return jsonify({
        "game": game.to_dict()
    }), 200


@game_bp.route("", methods=["POST"])
@admin_required
def create_game():
    data = request.get_json()

    required_fields = ["title", "description", "price", "categoryId"]

    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"El campo {field} es obligatorio"}), 400

    category = Category.query.get(data["categoryId"])

    if not category:
        return jsonify({"message": "Categoría no encontrada"}), 404

    game = Game(
        title=data["title"],
        description=data["description"],
        price=data["price"],
        image_url=data.get("imageUrl"),
        developer=data.get("developer"),
        publisher=data.get("publisher"),
        release_date=data.get("releaseDate"),
        category_id=data["categoryId"]
    )

    db.session.add(game)
    db.session.commit()

    return jsonify({
        "message": "Juego creado correctamente",
        "game": game.to_dict()
    }), 201


@game_bp.route("/<int:game_id>", methods=["PUT"])
@admin_required
def update_game(game_id):
    game = Game.query.get(game_id)

    if not game:
        return jsonify({"message": "Juego no encontrado"}), 404

    data = request.get_json()

    game.title = data.get("title", game.title)
    game.description = data.get("description", game.description)
    game.price = data.get("price", game.price)
    game.image_url = data.get("imageUrl", game.image_url)
    game.developer = data.get("developer", game.developer)
    game.publisher = data.get("publisher", game.publisher)

    if data.get("categoryId"):
        category = Category.query.get(data["categoryId"])

        if not category:
            return jsonify({"message": "Categoría no encontrada"}), 404

        game.category_id = data["categoryId"]

    db.session.commit()

    return jsonify({
        "message": "Juego actualizado correctamente",
        "game": game.to_dict()
    }), 200


@game_bp.route("/<int:game_id>", methods=["DELETE"])
@admin_required
def delete_game(game_id):
    game = Game.query.get(game_id)

    if not game:
        return jsonify({"message": "Juego no encontrado"}), 404

    db.session.delete(game)
    db.session.commit()

    return jsonify({
        "message": "Juego eliminado correctamente"
    }), 200