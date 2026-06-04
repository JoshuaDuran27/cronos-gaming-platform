import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import type { CartResponse } from "../types/game";

function Cart() {
  const userId = 1;

  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await axiosClient.get(`/cart/${userId}`);
      setCartData(response.data);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (gameId: number) => {
    try {
      await axiosClient.delete(`/cart/${userId}/items/${gameId}`);
      await fetchCart();
    } catch (error) {
      console.error("Error al eliminar juego:", error);
    }
  };

  const clearCart = async () => {
    try {
      await axiosClient.delete(`/cart/${userId}/clear`);
      await fetchCart();
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <h2 className="loading">Cargando carrito...</h2>;
  }

  const items = cartData?.cart.items || [];
  const total = cartData?.total || 0;

  return (
    <main className="page-container">
      <h1>Carrito de compras</h1>

      {items.length === 0 ? (
        <section className="empty-cart">
          <h2>Tu carrito está vacío</h2>
          <p>Explora el catálogo y agrega tus videojuegos favoritos.</p>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.game.imageUrl} alt={item.game.title} />

                <div className="cart-item-info">
                  <span>{item.game.category?.name}</span>
                  <h3>{item.game.title}</h3>
                  <p>{item.game.developer}</p>
                </div>

                <strong>${item.game.price} MXN</strong>

                <button
                  className="danger-button"
                  onClick={() => removeFromCart(item.game.id)}
                >
                  Eliminar
                </button>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Resumen</h2>

            <div className="summary-row">
              <span>Juegos</span>
              <strong>{items.length}</strong>
            </div>

            <div className="summary-row">
              <span>Total</span>
              <strong>${total} MXN</strong>
            </div>

            <button className="primary-button">
              Finalizar compra
            </button>

            <button className="secondary-button" onClick={clearCart}>
              Vaciar carrito
            </button>
          </aside>
        </section>
      )}
    </main>
  );
}

export default Cart;