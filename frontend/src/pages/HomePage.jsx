import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const API = "http://localhost:5000/api/products";

function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Fetch products whenever search changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = async (query) => {
    setLoading(true);
    setError("");
    try {
      const url = query.trim()
        ? `${API}?search=${encodeURIComponent(query.trim())}`
        : API;

      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Rajesh Electronics</h1>
        <div className="header-right">
          <span className="welcome-text">
            Hi, {user?.name} {user?.role === "admin" && "(Admin)"}
          </span>
          {user?.role === "admin" && (
            <button onClick={() => navigate("/admin")} className="nav-btn">
              Admin Panel
            </button>
          )}
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="home-content">
        {/* Search bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder='Search products — e.g. "phone", "charger"...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : products.length === 0 ? (
          <div className="no-products">
            <p>
              {search
                ? `No products found for "${search}"`
                : "No products available yet."}
            </p>
          </div>
        ) : (
          <>
            {search && (
              <p className="search-results-count">
                {products.length} result{products.length !== 1 && "s"} for "
                {search}"
              </p>
            )}
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default HomePage;
