import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import type { WishlistItem } from "../types/game";

function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const response = await axiosClient.get("/wishlist");
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error("Error al cargar wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (gameId: number) => {
    try {
      await axiosClient.delete(`/wishlist/items/${gameId}`);
      await fetchWishlist();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al eliminar de wishlist";

      alert(message);
    }
  };

  const addToCart = async (gameId: number) => {
    try {
      await axiosClient.post("/cart/items", {
        gameId,
      });

      alert("Juego agregado al carrito");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al agregar al carrito";

      alert(message);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return <h2 className="loading">Cargando wishlist...</h2>;
  }

  return (
    <main className="page-container">
      <h1>Mi Wishlist</h1>

      {wishlist.length === 0 ? (
        <section className="empty-cart">
          <h2>Tu wishlist está vacía</h2>
          <p>Agrega juegos desde el catálogo o desde el detalle del juego.</p>
        </section>
      ) : (
        <section className="games-grid">
          {wishlist.map((item) => (
            <div className="game-card" key={item.id}>
              <img src={item.game.imageUrl} alt={item.game.title} />

              <div className="game-card-content">
                <span className="game-category">
                  {item.game.category?.name}
                </span>

                <h3>{item.game.title}</h3>

                <p>{item.game.description}</p>

                <div className="game-card-footer">
                  <strong>${item.game.price} MXN</strong>
                </div>

                <div className="wishlist-actions">
                  <button onClick={() => addToCart(item.game.id)}>
                    Agregar al carrito
                  </button>

                  <button
                    className="danger-button"
                    onClick={() => removeFromWishlist(item.game.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default Wishlist;