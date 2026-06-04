import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        CRONOS
      </Link>

      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/catalog">Catálogo</Link>
        <Link to="/cart">Carrito</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Registro</Link>
      </div>
    </nav>
  );
}

export default Navbar;