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
import api from "./api";

export default function App() {
  const [user, setUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get("/users");
      if (data.success) {
        setUser(data.user);
      }
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
          {/* Public routes */}
          <Route
            path="/register"
            element={
              !user ? (
                <div className="auth-page">
                  <Register />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              !user ? (
                <div className="auth-page">
                  <Login setUser={setUser} />
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Protected route */}
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
        </Routes>
      </div>
    </Router>
  );
}
