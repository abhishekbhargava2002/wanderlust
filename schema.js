const Joi = require("joi");
const review = require("./models/review");

const listingSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(1000).allow(""),
  image: Joi.string().uri().allow("", null), // ✅ now accepts plain string
  price: Joi.number().min(0).required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
  //STEP-4
  category: Joi.string().valid(
      "Trending", "Hotels", "Cafes", "Nature", "City Stay",
      "Beach", "Mountains", "Historic", "Amazing Pools",
      "Camping", "Boats", "Pet Friendly", "Homes", "Luxury"
    ).required(),
});


module.exports = { listingSchema };






 


//validation for Review in server-side
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required()
})