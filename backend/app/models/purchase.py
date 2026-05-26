from datetime import datetime
from app.extensions import db


class Purchase(db.Model):
    __tablename__ = "purchases"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="COMPLETED")
    payment_method = db.Column(db.String(100), nullable=False, default="SIMULATED_PAYMENT")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="purchases")
    items = db.relationship("PurchaseItem", back_populates="purchase", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "totalAmount": float(self.total_amount),
            "status": self.status,
            "paymentMethod": self.payment_method,
            "items": [item.to_dict() for item in self.items],
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class PurchaseItem(db.Model):
    __tablename__ = "purchase_items"

    id = db.Column(db.Integer, primary_key=True)

    purchase_id = db.Column(db.Integer, db.ForeignKey("purchases.id"), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey("games.id"), nullable=False)

    price_at_purchase = db.Column(db.Numeric(10, 2), nullable=False)

    purchase = db.relationship("Purchase", back_populates="items")
    game = db.relationship("Game", back_populates="purchase_items")

    def to_dict(self):
        return {
            "id": self.id,
            "purchaseId": self.purchase_id,
            "game": self.game.to_dict() if self.game else None,
            "priceAtPurchase": float(self.price_at_purchase),
        }