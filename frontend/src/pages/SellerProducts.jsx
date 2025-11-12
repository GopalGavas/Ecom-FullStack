import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/SellerProducts.css";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/sellers/products");
      if (data.success) {
        setProducts(data.products);
      } else {
        setError("Failed to fetch products.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await api.put(`/sellers/products/${id}/delete`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Loading your products...</p>;
  if (error) return <p className="error">{error}</p>;

  if (products.length === 0)
    return (
      <div className="no-products">
        <h3>You haven’t added any products yet.</h3>
        <button onClick={() => navigate("/add-product")}>Add Product</button>
      </div>
    );

  return (
    <div className="seller-products">
      <h2>Your Products</h2>
      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <img
              src={p.imageUrl || "/placeholder.jpg"} // fallback if image missing
              alt={p.title}
              className="product-image"
            />
            <div className="product-info">
              <h3>{p.title}</h3>
              <p className="brand">{p.brandName}</p>
              <p className="price">₹{p.price}</p>
              <p className="category">{p.category}</p>
              <p className="quantity">
                Quantity: {p.quantity ?? "Not specified"}
              </p>
            </div>
            <div className="actions">
              <button onClick={() => navigate(`/edit-product/${p._id}`)}>
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
