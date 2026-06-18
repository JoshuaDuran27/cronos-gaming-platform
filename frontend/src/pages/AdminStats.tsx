import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import type { AdminStatsResponse } from "../types/game";

function AdminStats() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axiosClient.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <h2 className="loading">Cargando estadísticas...</h2>;
  }

  if (!stats) {
    return <h2 className="loading">No se pudieron cargar las estadísticas</h2>;
  }

  return (
    <main className="page-container">
      <h1>Dashboard de Estadísticas</h1>

      <section className="stats-grid">
        <article className="stats-card">
          <span>Usuarios</span>
          <strong>{stats.totalUsers}</strong>
        </article>

        <article className="stats-card">
          <span>Juegos</span>
          <strong>{stats.totalGames}</strong>
        </article>

        <article className="stats-card">
          <span>Compras</span>
          <strong>{stats.totalPurchases}</strong>
        </article>

        <article className="stats-card">
          <span>Ingresos simulados</span>
          <strong>${stats.totalRevenue.toFixed(2)} MXN</strong>
        </article>
      </section>

      <section className="top-games-section">
        <h2>Top juegos más vendidos</h2>

        {stats.topGames.length === 0 ? (
          <p className="empty-reviews">
            Aún no hay suficientes compras registradas.
          </p>
        ) : (
          <div className="top-games-list">
            {stats.topGames.map((game, index) => (
              <article className="top-game-item" key={game.id}>
                <span className="top-position">#{index + 1}</span>

                <img src={game.imageUrl} alt={game.title} />

                <div>
                  <h3>{game.title}</h3>
                  <p>{game.sales} ventas</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminStats;