const express = require("express");
const router = express.Router();
// const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//MVC -- Model,View,Controller
const userController = require("../controllers/user.js");

//Route.route
router
  .route("/signup")
  .get((req, res) => {
    // Signup User - GET
    res.render("users/signup.ejs");
  })
  .post(userController.SignUp);

//Login --> Route.route
router
  .route("/login")
  .get((req, res) => {
    res.render("users/login.ejs");
  })
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.Login
  );

//logout
router.get("/logout", userController.logout);

module.exports = router;

// Signup User - GET
// router.get("/signup", (req, res) => {
//   res.render("users/signup.ejs");
// });

// Signup User - POST
// router.post("/signup", userController.SignUp);

// //Login
// router.get("/login", (req, res) => {
//   res.render("users/login.ejs");
// });

// //authenticate
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.Login
// );
