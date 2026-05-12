import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

const API = "http://localhost:5000/api/cart";

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart when user logs in
  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add product to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        showToast("Added to cart");
        return { success: true };
      }

      const data = await res.json();
      showToast(data.message || "Failed to add", "error");
      return { success: false, message: data.message };
    } catch (error) {
      showToast("Failed to add to cart", "error");
      return { success: false, message: "Failed to add to cart" };
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await fetch(`${API}/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        showToast("Cart updated");
      }
    } catch (error) {
      showToast("Failed to update quantity", "error");
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`${API}/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        showToast("Removed from cart");
      }
    } catch (error) {
      showToast("Failed to remove item", "error");
    }
  };

  // Total item count (sum of quantities)
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Total price
  const cartTotal = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
