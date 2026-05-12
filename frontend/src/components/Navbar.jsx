import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === "admin";

  if (!user) return null;

  return (
    <header className="home-header">
      <h1
        className="brand-link"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        Rajesh Electronics
      </h1>

      <div className="header-right">
        <span className="welcome-text">
          Hi, {user.name} {isAdmin && "(Admin)"}
        </span>

        {!isAdmin && (
          <button
            className={`cart-btn ${location.pathname === "/cart" ? "cart-btn-active" : ""}`}
            onClick={() => navigate("/cart")}
          >
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        )}

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
