from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    phone = data.get("phone")
    address = data.get("address")

    if not first_name or not last_name or not email:
        return jsonify({"message": "Nombre, apellidos y correo son obligatorios"}), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"message": "El correo ya está registrado"}), 409

    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        address=address
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Usuario registrado correctamente",
        "user": new_user.to_dict()
    }), 201


@auth_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()

    return jsonify({
        "users": [user.to_dict() for user in users]
    }), 200