import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [error, setError] = useState("");

  // Fetch cart for order summary
  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart");
      if (data.success) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error("Fetch Cart Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    setError("");

    // simple required field validation
    if (
      !shipping.fullName ||
      !shipping.phone ||
      !shipping.addressLine1 ||
      !shipping.city ||
      !shipping.state ||
      !shipping.pincode
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const { data } = await api.post("/orders/checkout", shipping);

      if (data.success) {
        navigate(`/order-success?orderId=${data.order._id}`);
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      setError("Something went wrong placing your order.");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!cart || cart.items.length === 0)
    return <p>Your cart is empty. Add items first.</p>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>Checkout</h2>

      {/* Order Summary */}
      <h3>Order Summary</h3>

      {cart.items.map((item) => (
        <div key={item.product._id} style={{ marginBottom: "10px" }}>
          <p>
            <strong>{item.product.title}</strong> x {item.quantity} — ₹
            {item.product.price * item.quantity}
          </p>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      {/* Shipping Form */}
      <h3>Shipping Details</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={shipping.fullName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={shipping.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="addressLine1"
          placeholder="Address Line 1"
          value={shipping.addressLine1}
          onChange={handleChange}
        />
        <input
          type="text"
          name="addressLine2"
          placeholder="Address Line 2 (optional)"
          value={shipping.addressLine2}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shipping.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={shipping.state}
          onChange={handleChange}
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={shipping.pincode}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={handleCheckout}
        style={{ marginTop: "20px", padding: "10px" }}
      >
        Place Order
      </button>

      {error && <p style={{ marginTop: "15px", color: "red" }}>{error}</p>}
    </div>
  );
}
