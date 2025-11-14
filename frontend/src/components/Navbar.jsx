import { Link } from "react-router-dom";
import api from "../api";
import "./Navbar.css";

export default function Navbar({ user, setUser }) {
  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      setUser(null); // Always clear user data, even if the API fails
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">
          SwiftMart
        </Link>
      </div>

      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/login" className="link">
              Login
            </Link>
            <Link to="/register" className="link">
              Register
            </Link>
          </>
        ) : user.role === "seller" ? (
          <>
            <Link to="/my-products" className="link">
              My Products
            </Link>
            <Link to="/add-product" className="link">
              Add Product
            </Link>

            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/products" className="link">
              View Products
            </Link>
            <Link to="/cart" className="link">
              Cart
            </Link>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
