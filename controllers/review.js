const Listing = require("../models/listing.js");
const Review = require("../models/review.js"); 

module.exports.reviewcreate = (async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    //authorization
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Add Review");
    res.redirect(`/listings/${listing._id}`);
  })



  module.exports.destoryreveiw = (async (req, res) => {
      let { id, reviewId } = req.params;
  
      //child to parent database update in parent
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
      //child database of review
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", "Delete Review");
  
      res.redirect(`/listings/${id}`);
    });