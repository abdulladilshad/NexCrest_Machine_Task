const Cart = require("../models/Cart");
const Product = require("../models/Product");

// GET /api/cart — get the logged-in user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.userId }).populate(
      "items.product",
      "name price description"
    );

    // If no cart exists yet, return empty items
    if (!cart) {
      return res.json({ items: [] });
    }

    res.json({ items: cart.items });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/cart — add a product to cart (or increase quantity)
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check that the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create cart for this user
    let cart = await Cart.findOne({ user: req.session.userId });

    if (!cart) {
      cart = new Cart({ user: req.session.userId, items: [] });
    }

    // Check if product is already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Populate before sending back
    await cart.populate("items.product", "name price description");

    res.json({ message: "Added to cart", items: cart.items });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/cart/:productId — update quantity of a specific item
const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.session.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product", "name price description");

    res.json({ message: "Quantity updated", items: cart.items });
  } catch (error) {
    console.error("Update quantity error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/cart/:productId — remove one product from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.session.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product", "name price description");

    res.json({ message: "Removed from cart", items: cart.items });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCart, addToCart, updateQuantity, removeFromCart };
