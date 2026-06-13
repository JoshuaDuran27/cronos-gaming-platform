from datetime import datetime
from app.extensions import db


class Game(db.Model):
    __tablename__ = "games"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)

    image_url = db.Column(db.String(500))
    developer = db.Column(db.String(150))
    publisher = db.Column(db.String(150))
    release_date = db.Column(db.Date)

    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    category = db.relationship("Category", back_populates="games")
    cart_items = db.relationship("CartItem", back_populates="game", cascade="all, delete-orphan")
    purchase_items = db.relationship("PurchaseItem", back_populates="game")
    library_items = db.relationship("Library", back_populates="game", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="game", cascade="all, delete-orphan")

    wishlist_items = db.relationship(
        "Wishlist",
        back_populates="game",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price": float(self.price),
            "imageUrl": self.image_url,
            "developer": self.developer,
            "publisher": self.publisher,
            "releaseDate": self.release_date.isoformat() if self.release_date else None,
            "category": self.category.to_dict() if self.category else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }