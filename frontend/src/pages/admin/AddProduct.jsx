import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/products";

function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.price || !form.description.trim()) {
      setError("All fields are required");
      return;
    }

    if (Number(form.price) < 0) {
      setError("Price cannot be negative");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          description: form.description,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/admin");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h2>Add New Product</h2>
          <button className="back-btn" onClick={() => navigate("/admin")}>
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Wireless Earbuds"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 1499"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Describe the product..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? "Saving..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
