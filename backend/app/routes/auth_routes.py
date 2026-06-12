from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from app.extensions import db
from app.models.user import User
from app.models.cart import Cart

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not first_name or not last_name or not email or not password:
        return jsonify({
            "message": "Nombre, apellidos, correo y contraseña son obligatorios"
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "message": "El correo ya está registrado"
        }), 409

    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email
    )

    new_user.set_password(password)

    db.session.add(new_user)
    db.session.flush()

    cart = Cart(user_id=new_user.id)
    db.session.add(cart)

    db.session.commit()

    return jsonify({
        "message": "Usuario registrado correctamente",
        "user": new_user.to_dict()
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "Correo y contraseña son obligatorios"
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "message": "Credenciales incorrectas"
        }), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Inicio de sesión exitoso",
        "accessToken": access_token,
        "user": user.to_dict()
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404

    return jsonify({
        "user": user.to_dict()
    }), 200


@auth_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.order_by(User.id.asc()).all()

    return jsonify({
        "users": [user.to_dict() for user in users]
    }), 200