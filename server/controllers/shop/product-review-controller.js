const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, reviewMessage, reviewValue } = req.body;
    const userId = req.user.id;
    const userName = req.user.userName;

    if (
      typeof reviewMessage !== "string" ||
      !reviewMessage.trim() ||
      !Number.isInteger(Number(reviewValue)) ||
      Number(reviewValue) < 1 ||
      Number(reviewValue) > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "A review message and rating from 1 to 5 are required.",
      });
    }

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      // orderStatus: "confirmed" || "delivered",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    const checkExistinfReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistinfReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage: reviewMessage.trim(),
      reviewValue: Number(reviewValue),
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteProductReview = async (req, res) => {
  try {
    const review = await ProductReview.findOneAndDelete({
      _id: req.params.reviewId,
      userId: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const reviews = await ProductReview.find({ productId: review.productId });
    const averageReview =
      reviews.length > 0
        ? reviews.reduce((sum, item) => sum + item.reviewValue, 0) /
          reviews.length
        : 0;

    await Product.findByIdAndUpdate(review.productId, { averageReview });

    return res.status(200).json({
      success: true,
      data: { _id: review._id },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error deleting review.",
    });
  }
};

module.exports = { addProductReview, getProductReviews, deleteProductReview };
