const mongoose = require("mongoose");
const Review = require("./review.js"); //import form review.js
const { listingSchema } = require("../schema.js");
const Schema = mongoose.Schema;
const { CATEGORIES } = require("../utils/categories"); //STEP - 2

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    fullname: String,
    url: String,
  },
  price: Number,
  //STEP-3 SearchBar
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", //reference
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", //reference
  },
  category: {
    type: String,
    enum: CATEGORIES, // Enforce allowed values
  },
});

//Phase-2 (a)
//Handling: Delete Listings
ListingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
