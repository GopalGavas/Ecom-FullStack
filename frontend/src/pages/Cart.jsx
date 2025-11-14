import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart");
      if (data.success) {
        setCart(data.cart);
      } else {
        setError("Failed to load cart");
      }
    } catch (err) {
      console.error("Fetch Cart Error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity (send numeric quantity)
  const handleQuantityChange = async (productId, action) => {
    try {
      // compute new quantity client-side from current cart state (safer)
      const currentItem = cart.items.find(
        (it) =>
          (it.product._id || it.product).toString() === productId.toString()
      );
      if (!currentItem) return;

      let newQty = currentItem.quantity + (action === "increase" ? 1 : -1);
      if (newQty < 1) return; // avoid zero or negative

      const { data } = await api.put("/cart/update", {
        productId,
        quantity: newQty, // send numeric value
      });

      if (data.success) {
        setCart(data.cart); // backend returns populated cart now
      } else {
        console.warn("Update failed", data.message);
      }
    } catch (err) {
      console.error("Quantity Update Error:", err);
    }
  };

  // Remove item (use DELETE route)
  const handleRemove = async (productId) => {
    if (!window.confirm("Remove this item?")) return;
    try {
      const { data } = await api.delete(`/cart/remove/${productId}`);
      if (data.success) {
        setCart(data.cart);
      } else {
        console.warn("Remove failed", data.message);
      }
    } catch (err) {
      console.error("Remove Item Error:", err);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear the entire cart?"))
      return;

    try {
      const { data } = await api.delete("/cart/clear");
      if (data.success) {
        setCart({ items: [] });
      } else {
        console.warn("Clear Cart failed", data.message);
      }
    } catch (err) {
      console.error("Clear Cart Error:", err);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) return <p className="cart-info">Loading cart...</p>;
  if (error) return <p className="cart-error">{error}</p>;
  if (!cart || cart.items.length === 0)
    return <p className="cart-info">Your cart is empty.</p>;

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="cart-wrapper">
      <h2>Your Cart</h2>

      <div className="cart-list">
        {cart.items.map((item) => (
          <div key={item.product._id} className="cart-card">
            <img
              src={
                item.product.imageUrl ||
                "https://via.placeholder.com/120x120?text=No+Image"
              }
              alt={item.product.title}
              className="cart-img"
            />

            <div className="cart-details">
              <h3>{item.product.title}</h3>
              <p className="cart-brand">{item.product.brandName}</p>
              <p className="cart-price">₹{item.product.price}</p>

              {/* Quantity Controls */}
              <div className="cart-quantity">
                <button
                  onClick={() =>
                    handleQuantityChange(item.product._id, "decrease")
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    handleQuantityChange(item.product._id, "increase")
                  }
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button
                className="cart-remove"
                onClick={() => handleRemove(item.product._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Total */}
      <div className="cart-summary">
        <h3>Total: ₹{totalPrice}</h3>
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>

        <button className="clear-cart-btn" onClick={handleClearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}
