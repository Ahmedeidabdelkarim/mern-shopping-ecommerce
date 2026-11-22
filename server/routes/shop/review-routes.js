const express = require("express");

const {
  addProductReview,
  deleteProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/add", authMiddleware, addProductReview);
router.delete("/:reviewId", authMiddleware, deleteProductReview);
router.get("/:productId", getProductReviews);

module.exports = router;
