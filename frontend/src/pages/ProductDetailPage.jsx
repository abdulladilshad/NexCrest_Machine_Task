import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

const API = "http://localhost:5000/api/products";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [addedMsg, setAddedMsg] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/${id}`, { credentials: "include" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Product not found");
      }

      const data = await res.json();
      setProduct(data.product);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    setAddedMsg("");

    const result = await addToCart(product._id);

    if (result.success) {
      setAddedMsg("Added to cart ✓");
      setTimeout(() => setAddedMsg(""), 2000);
    } else {
      setAddedMsg(result.message || "Failed to add");
    }

    setAdding(false);
  };

  if (loading) {
    return (
      <div className="detail-page">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page">
        <div className="detail-container">
          <p className="error-message">{error}</p>
          <button className="back-link" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* Back button */}
        <button className="back-link" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        {/* Product info */}
        <div className="detail-card">
          <h1 className="detail-name">{product.name}</h1>
          <span className="detail-price">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <div className="detail-divider" />

          <div className="detail-section">
            <h2 className="detail-section-title">Description</h2>
            <p className="detail-description">{product.description}</p>
          </div>

          <div className="detail-divider" />

          {/* Add to Cart */}
          <div className="detail-cart-row">
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? "Adding..." : "🛒 Add to Cart"}
            </button>
            {addedMsg && <span className="added-msg">{addedMsg}</span>}
          </div>

          <div className="detail-divider" />

          <div className="detail-meta">
            <span>
              Added on{" "}
              {new Date(product.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
