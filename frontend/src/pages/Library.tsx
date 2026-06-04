import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import type { Game } from "../types/game";

interface LibraryItem {
  id: number;
  userId: number;
  game: Game;
  acquiredAt: string;
}

function Library() {
  const userId = 1;

  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await axiosClient.get(`/library/${userId}`);
        setLibrary(response.data.library);
      } catch (error) {
        console.error("Error al cargar biblioteca:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  if (loading) {
    return <h2 className="loading">Cargando biblioteca...</h2>;
  }

  return (
    <main className="page-container">
      <h1>Mi Biblioteca</h1>

      {library.length === 0 ? (
        <section className="empty-cart">
          <h2>Aún no tienes juegos</h2>
          <p>Compra juegos desde el catálogo para agregarlos a tu biblioteca.</p>
        </section>
      ) : (
        <section className="games-grid">
          {library.map((item) => (
            <div className="game-card" key={item.id}>
              <img src={item.game.imageUrl} alt={item.game.title} />

              <div className="game-card-content">
                <span className="game-category">
                  {item.game.category?.name}
                </span>

                <h3>{item.game.title}</h3>

                <p>{item.game.description}</p>

                <div className="game-card-footer">
                  <strong>Adquirido</strong>
                  <button>Instalar</button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default Library;