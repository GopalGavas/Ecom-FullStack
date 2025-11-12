import { useEffect, useState } from "react";
import api from "../api";
import "../styles/ViewProducts.css";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async (category = "All", search = "") => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (category && category !== "All") params.category = category;
      if (search) params.search = search;

      const { data } = await api.get("/products", { params });

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      console.error("Fetch Products Error:", err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/products");
      if (data.success) {
        const unique = new Set();
        (data.products || []).forEach((p) => {
          if (p.category) unique.add(p.category);
        });
        setCategories(["All", ...Array.from(unique).sort()]);
      }
    } catch (err) {
      console.error("Fetch Categories Error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts("All", "");
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategory, searchTerm);
  }, [selectedCategory, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(selectedCategory, searchTerm);
  };

  const handleAddToCart = (productId) => {
    alert(`Product ${productId} added to cart!`);
  };

  return (
    <div className="vp-wrapper">
      {/* --- Horizontal Filter Bar --- */}
      <div className="vp-filterbar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`vp-filter-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="vp-searchbar">
        <form onSubmit={handleSearch} className="vp-search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading ? (
        <p className="vp-info">Loading products...</p>
      ) : error ? (
        <p className="vp-error">{error}</p>
      ) : products.length === 0 ? (
        <p className="vp-info">No products found.</p>
      ) : (
        <div className="vp-grid">
          {products.map((product) => (
            <div key={product._id} className="vp-card">
              <img
                src={
                  product.imageUrl ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={product.title}
                className="vp-image"
              />
              <div className="vp-info-block">
                <h3 className="vp-title">{product.title}</h3>
                <p className="vp-brand">{product.brandName}</p>
                <p className="vp-price">₹{product.price ?? "—"}</p>
                <p className="vp-category">{product.category}</p>
              </div>
              <button
                className="vp-cta"
                onClick={() => handleAddToCart(product._id)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
