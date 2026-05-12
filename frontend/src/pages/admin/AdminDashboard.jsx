import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/products";

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null); // for confirm dialog

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API, { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setDeleteId(null);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to delete product");
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="admin-page">
      <main className="admin-content">
        <div className="admin-top-bar">
          <h2>Manage Products</h2>
          <button
            className="add-btn"
            onClick={() => navigate("/admin/add")}
          >
            + Add Product
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {products.length === 0 ? (
          <p className="empty-text">No products yet. Add your first product!</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="td-name">{product.name}</td>
                    <td className="td-price">₹{product.price}</td>
                    <td className="td-desc">{product.description}</td>
                    <td className="td-actions">
                      <div className="actions-group">
                        <button
                          className="edit-btn"
                          onClick={() =>
                            navigate(`/admin/edit/${product._id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => setDeleteId(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this product? This cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={() => handleDelete(deleteId)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
