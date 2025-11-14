import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddProduct from "./pages/AddProduct";
import api from "./api";
import SellerProducts from "./pages/SellerProducts";
import EditProduct from "./pages/EditProduct";
import ViewProducts from "./pages/ViewProducts";
import Cart from "./pages/Cart";
import Checkout from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";

export default function App() {
  const [user, setUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get("/users");
      if (data.success) setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <div className="container">
        <Routes>
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" replace />}
          />
          <Route
            path="/login"
            element={
              !user ? <Login setUser={setUser} /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/"
            element={
              user ? (
                <div className="welcome-box">
                  {user.role === "seller" ? (
                    <h2>Seller Logged In: {user.name}</h2>
                  ) : (
                    <h2>Hello, {user.name}</h2>
                  )}
                  <p>Welcome to SwiftMart 👋</p>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/add-product"
            element={
              user && user.role === "seller" ? (
                <AddProduct />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/my-products"
            element={
              user && user.role === "seller" ? (
                <div className="auth-page">
                  <SellerProducts />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              user && user.role === "seller" ? (
                <div className="auth-page">
                  <EditProduct />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/products" element={<ViewProducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}
