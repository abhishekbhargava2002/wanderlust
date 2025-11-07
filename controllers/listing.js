const Listing = require("../models/listing.js");
const { CATEGORIES } = require("../utils/categories"); //STEP - 3

//STEP-2 SearchBar
// GET /search — search by location
module.exports.search = async (req, res) => {
  const { query } = req.query;

  try {
    let listings;

    if (!query || query.trim() === "") {
      // If no search entered, show all
      listings = await Listing.find({});
    } else {
      // Search by location field (case-insensitive)
      listings = await Listing.find({
        location: { $regex: query, $options: "i" },
      });
    }

    res.render("listings/index", {
      allListings: listings,
      category: null, // no active category
      searchQuery: query,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching locations");
  }
};

// Route to display all listings or filter by category
module.exports.index = async (req, res) => {
  const { category } = req.query; // example: /listings?category=Historic
  let allListings;

  if (category && CATEGORIES.includes(category)) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings, category });
};

//Show a New Listing form
module.exports.renderNewForm = (req, res) => {
  //connecting login route
  res.render("listings/new.ejs");
};

//Creating a New listing
module.exports.newListing = async (req, res) => {
  // const { error } = listingSchema.validate(req.body);
  // if (error) {
  //   throw new ExpressError(400, error.details[0].message);
  // }

  const { title, description, image, price, location, country, category } =
    req.body;

  const newListing = new Listing({
    title,
    description,
    image: {
      url:
        image ||
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    }, // wrap manually or defalut image save
    price,
    location,
    country,
    category,
  });
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created"); // 4️⃣ Example route
  res.redirect("/listings");
};

//Show listing
module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  let showdata = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!showdata) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { showdata });
};

//show the edit of listing
module.exports.showeditlisting = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { list });
};

//Find edit listing
module.exports.editlisting = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;
    //Authorization for listing if user is same or not

    let updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        title,
        description,
        image: {
          url:
            image ||
            "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        },
        price,
        location,
        country,
      },
      { new: true, runValidators: true }
    );

    req.flash("success", "Update Listing Data");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    next(error);
  }
};

module.exports.deletelisting = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  // console.log(deleteListing);
  req.flash("success", "Delete Listing");
  res.redirect("/listings");
};
