require("dotenv").config();

//Project: Phase-1(part-a)
//Basic set up
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
//mongo session store step-1
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
//Configuring Strategy - 1
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const mongodb_url = "mongodb://127.0.0.1:27017/wanderlust";
//Always wrap your connection string in quotes
const dbs_url = process.env.DB_URL;

//Database connection
main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbs_url);
}

//mongo store step-2
const store = MongoStore.create({
  mongoUrl: dbs_url,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600, //24-hours after data is remove
});

store.once("error", () => {
  console.log("error in monogo session", err);
});

// Implement session in project
// 1 Session setup (flash uses session)
const sessionOptions = {
  store, //data is stored in atlos database
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,

  // Adding cookie options
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires 1 week from now
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie lasts 1 week
    httpOnly: true, // Helps prevent XSS attacks (client-side JS can't access cookie)
  },
};

//Enable session middleware
app.use(session(sessionOptions));
app.use(flash()); // 2 Enable flash middleware

// Configuring Strategy - 2 --> No multiple time enter same informations
app.use(passport.initialize()); // Middleware to initialize Passport
app.use(passport.session()); // Middleware for persistent login sessions

// Correct way to configure the strategy
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and deserialize users for session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 3 Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  //add styling
  res.locals.currUser = req.user;
  next();
});

// //Demo User
// app.get("/demouser", async(req,res) => {
//   let fakeUser = new User({
//     email: "abhishek@gmail.com",
//     username: "abhishekbhargava"
//   });
//   let newUser = await User.register(fakeUser,"HelloWorld");
//   res.send(newUser);
// })

//phase-2 (part-b)

app.use("/", listingRouter); //Restructuring Listings
app.use("/", reviewRouter); //Restructuring Reviews
app.use("/", userRouter); // userRouter

// Catch all undefined routes (404)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//Error.ejs  -- 4 -->
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something wend wrong" } = err;
  res.render("error.ejs", { err });
  //   res.status(500).send(`Error: ${err.message}`);
});

//  Error handling
// app.use((err, req, res, next) => {
//   const { statusCode = 500 } = err;
//   if (!err.message) err.message = "Something went wrong!";
//   res.status(statusCode).render("error.ejs", { err }); // sets status
// });

app.listen(port, () => {
  console.log(`sever is listering to ${port}`);
});
