const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const isAuthenticated = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

// All product routes require login
router.use(isAuthenticated);

// Any logged-in user can view products
router.get("/", getAllProducts);
router.get("/:id", getProduct);

// Only admin can create, update, delete
router.post("/", isAdmin, createProduct);
router.put("/:id", isAdmin, updateProduct);
router.delete("/:id", isAdmin, deleteProduct);

module.exports = router;
