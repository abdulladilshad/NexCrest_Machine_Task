const express = require("express");
const isAuthenticated = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
} = require("../controllers/cartController");

const router = express.Router();

// All cart routes require login
router.use(isAuthenticated);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:productId", updateQuantity);
router.delete("/:productId", removeFromCart);

module.exports = router;
