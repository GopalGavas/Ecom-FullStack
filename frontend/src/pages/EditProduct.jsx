import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    brandName: "",
    price: "",
    quantity: "",
    category: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/sellers/products/${id}`);
        if (data.success) {
          const { title, brandName, price, quantity, category, imageUrl } =
            data.product;
          setFormData({
            title,
            brandName,
            price,
            quantity: quantity ?? "",
            category,
            imageUrl: imageUrl ?? "",
          });
        } else {
          setMessage("Failed to fetch product details");
        }
      } catch (error) {
        console.error(error);
        setMessage("Error loading product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/sellers/products/${id}`, formData);
      if (data.success) {
        alert("Product updated successfully!");
        navigate("/my-products");
      } else {
        alert("Failed to update product.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product.");
    }
  };

  if (loading) return <p>Loading product details...</p>;

  return (
    <div className="auth-page">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Edit Product</h2>

        {message && <p className="error">{message}</p>}

        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Brand Name</label>
        <input
          type="text"
          name="brandName"
          value={formData.brandName}
          onChange={handleChange}
          required
        />

        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />

        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
        />

        <label>Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <label>Image URL</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}
