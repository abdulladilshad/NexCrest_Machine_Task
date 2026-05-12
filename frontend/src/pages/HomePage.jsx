import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const API = "http://localhost:5000/api/products";

function HomePage() {
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
