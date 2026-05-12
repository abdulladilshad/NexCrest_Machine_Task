import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function CartPage() {
  const { items, loading, cartTotal, updateQuantity, removeFromCart } =
    useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="cart-page">
        <Loader />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2 className="cart-title">Your Cart</h2>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
            <button className="nav-btn" onClick={() => navigate("/")}>
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Cart items list */}
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div className="cart-item-info">
                    <h3
                      className="cart-item-name"
                      onClick={() => navigate(`/product/${item.product._id}`)}
                    >
                      {item.product.name}
                    </h3>
                    <p className="cart-item-price">
                      ₹{item.product.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="cart-item-actions">
                    {/* Quantity controls */}
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <span className="cart-item-subtotal">
                      ₹
                      {(item.product.price * item.quantity).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    {/* Remove button */}
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart summary */}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Total ({items.length} items)</span>
                <span className="cart-summary-total">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
