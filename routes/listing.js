const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

//MVC --- Model,View,Controller
const ListingController = require("../controllers/listing.js");

//Validation for Schema in (Middleware)
const validateListings = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

//STEP-2 SearchBar
router.get("/listings/search", ListingController.search);//search — search by location

//Index Route
router.get("/listings", ListingController.index); //callback function

//Create -->new and creatr route
//New Route
router.get("/listings/new", isLoggedIn, ListingController.renderNewForm);

//Create Route
router.post(
  "/listings",
  isLoggedIn,
  validateListings,
  wrapAsync(ListingController.newListing)
);

//show route
router.get("/listings/:id", ListingController.showlisting);

//Upadte: Edit and Update Route

//Edit Route
router.get(
  "/listings/:id/edit",
  isLoggedIn,
  isOwner,
  ListingController.showeditlisting
);

//Update Route
router.put("/listings/:id", isLoggedIn, isOwner, ListingController.editlisting);

//Delete: Delete Routes
router.delete(
  "/listings/:id",
  isLoggedIn,
  isOwner,
  ListingController.deletelisting
);

module.exports = router;
