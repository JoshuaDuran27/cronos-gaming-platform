from datetime import date

from app import create_app
from app.extensions import db
from app.models.category import Category
from app.models.game import Game

app = create_app()


categories_data = [
    {
        "name": "Acción",
        "description": "Juegos enfocados en combate, reflejos rápidos y acción constante."
    },
    {
        "name": "RPG",
        "description": "Juegos de rol con progresión, historia y desarrollo de personajes."
    },
    {
        "name": "Aventura",
        "description": "Juegos centrados en exploración, narrativa y descubrimiento."
    },
    {
        "name": "Deportes",
        "description": "Juegos basados en disciplinas deportivas reales o ficticias."
    },
    {
        "name": "Estrategia",
        "description": "Juegos que requieren planeación, gestión y toma de decisiones."
    }
]


games_data = [
    {
        "title": "Halo Infinite",
        "description": "Shooter de ciencia ficción donde el Jefe Maestro enfrenta nuevas amenazas en un mundo abierto.",
        "price": 899.00,
        "image_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/1240440/header.jpg",
        "developer": "343 Industries",
        "publisher": "Xbox Game Studios",
        "release_date": date(2021, 12, 8),
        "category": "Acción"
    },
    {
        "title": "Elden Ring",
        "description": "RPG de mundo abierto con combate desafiante, exploración profunda y fantasía oscura.",
        "price": 1199.00,
        "image_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
        "developer": "FromSoftware",
        "publisher": "Bandai Namco Entertainment",
        "release_date": date(2022, 2, 25),
        "category": "RPG"
    },
    {
        "title": "Marvel's Spider-Man Remastered",
        "description": "Aventura de acción protagonizada por Spider-Man en una Nueva York abierta y dinámica.",
        "price": 999.00,
        "image_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg",
        "developer": "Insomniac Games",
        "publisher": "PlayStation Publishing LLC",
        "release_date": date(2022, 8, 12),
        "category": "Aventura"
    },
    {
        "title": "Cyberpunk 2077",
        "description": "RPG futurista de mundo abierto ambientado en Night City.",
        "price": 799.00,
        "image_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        "developer": "CD PROJEKT RED",
        "publisher": "CD PROJEKT RED",
        "release_date": date(2020, 12, 10),
        "category": "RPG"
    },
    {
        "title": "EA SPORTS FC 25",
        "description": "Simulador de fútbol con clubes, ligas y modos competitivos.",
        "price": 1299.00,
        "image_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/2669320/header.jpg",
        "developer": "EA Canada",
        "publisher": "Electronic Arts",
        "release_date": date(2024, 9, 27),
        "category": "Deportes"
    },
    {
        "title": "Age of Empires IV",
        "description": "Juego de estrategia en tiempo real basado en civilizaciones históricas.",
        "price": 699.00,
        "image_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/1466860/header.jpg",
        "developer": "Relic Entertainment",
        "publisher": "Xbox Game Studios",
        "release_date": date(2021, 10, 28),
        "category": "Estrategia"
    }
]


def seed_database():
    with app.app_context():
        if Category.query.first() or Game.query.first():
            print("La base de datos ya tiene datos. Seed cancelado.")
            return

        categories = {}

        for category_data in categories_data:
            category = Category(
                name=category_data["name"],
                description=category_data["description"]
            )
            db.session.add(category)
            categories[category.name] = category

        db.session.flush()

        for game_data in games_data:
            game = Game(
                title=game_data["title"],
                description=game_data["description"],
                price=game_data["price"],
                image_url=game_data["image_url"],
                developer=game_data["developer"],
                publisher=game_data["publisher"],
                release_date=game_data["release_date"],
                category=categories[game_data["category"]]
            )
            db.session.add(game)

        db.session.commit()
        print("Seed ejecutado correctamente.")


if __name__ == "__main__":
    seed_database()