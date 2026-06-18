import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        CRONOS
      </Link>

      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/catalog">Catálogo</Link>

        {isAuthenticated && (
          <>
            <Link to="/cart">Carrito</Link>
            <Link to="/library">Biblioteca</Link>
              <Link to="/wishlist">Wishlist</Link>
          </>
        )}



        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </>
        ) : (
          <>
            <span className="nav-user">Hola, {user?.firstName}</span>
            <button className="logout-nav-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        )}
          {user?.role === "ADMIN" && (
  <>
    <Link to="/admin">Juegos</Link>
    <Link to="/admin/categories">Categorías</Link>
    <Link to="/admin/stats">Estadísticas</Link>
  </>
)}
      </div>
    </nav>
  );
}

export default Navbar;