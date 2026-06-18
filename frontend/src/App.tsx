import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Library from "./pages/Library";
import GameDetail from "./pages/GameDetail";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
          <Route path="/games/:id" element={<GameDetail />} />
        <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
          <Route path="/library" element={<Library />} />
        <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;