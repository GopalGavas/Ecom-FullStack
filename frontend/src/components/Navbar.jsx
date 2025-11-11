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
            <button className="link">My Products</button>
            <button className="link">Add Product</button>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="link">View Products</button>
            <button className="link">Cart</button>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
