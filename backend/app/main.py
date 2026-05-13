from flask import jsonify


def register_main_routes(app):

    @app.route("/")
    def home():
        return jsonify({
            "message": "CRONOS Gaming API funcionando correctamente"
        })