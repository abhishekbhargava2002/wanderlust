const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js"); //reviews
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

//validate Review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//MVC --- Model,View,Controller
const ReviewController = require("../controllers/review.js");

//Reviews
//post Route -- submitting the form --> review add
router.post(
  "/listings/:id/reviews",
  isLoggedIn,
  validateReview,
  wrapAsync(ReviewController.reviewcreate)
);

//Delete Review Route
router.delete(
  "/listings/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(ReviewController.destoryreveiw)
);

module.exports = router;
