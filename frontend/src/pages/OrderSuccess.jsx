import { useSearchParams, Link } from "react-router-dom";
import "../styles/OrderSuccess.css";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">🎉</div>

        <h1 className="success-title">Order Placed Successfully!</h1>

        <p className="success-message">
          Thank you for shopping with us. Your order has been confirmed and is
          now being processed.
        </p>

        <div className="order-info">
          <p>
            <strong>Order ID:</strong>
          </p>
          <p className="order-id">{orderId || "N/A"}</p>
        </div>

        <div className="success-actions">
          <Link to="/orders" className="success-btn">
            View My Orders
          </Link>

          <Link to="/" className="continue-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
