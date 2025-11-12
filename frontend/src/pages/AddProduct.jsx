import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/AddProduct.css";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    brandName: "",
    quantity: "",
    category: "",
    imageUrl: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data } = await api.post("/sellers/products/add", form);

      if (data.success) {
        setMessage("✅ Product added successfully!");
        setTimeout(() => navigate("/my-products"), 1200);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Failed to add product");
    }
  };

  return (
    <div className="product-card">
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="brandName"
          placeholder="Brand Name"
          value={form.brandName}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <input
          name="imageUrl"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={handleChange}
        />

        <button type="submit">Add Product</button>
      </form>
      {message && <p className="msg">{message}</p>}
    </div>
  );
}
