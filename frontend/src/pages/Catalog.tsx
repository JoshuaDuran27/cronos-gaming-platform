import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import GameCard from "../components/GameCard";
import type {Game} from "../types/game";

function Catalog() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axiosClient.get("/games");
        setGames(response.data.games);
      } catch (error) {
        console.error("Error al cargar juegos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <h2 className="loading">Cargando catálogo...</h2>;
  }

  return (
    <main className="page-container">
      <h1>Catálogo de Videojuegos</h1>

      <section className="games-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </section>
    </main>
  );
}

export default Catalog;