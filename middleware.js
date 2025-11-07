const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //psot-login page
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/login"); // Redirect to login instead of rendering listings
  }
  next();
};

//post-login page
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//authorization for listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//authorization for reviews
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params; // id = listing id, reviewId = review id

  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
