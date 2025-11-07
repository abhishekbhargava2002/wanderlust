const User = require("../models/user.js");

// Signup User - POST
module.exports.SignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email }); //inserting information
    const registeredUser = await User.register(newUser, password);
    req.logout((registeredUser, err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

//authenticate --> Login User
module.exports.Login = async (req, res) => {
  // after successful login

  const redirectUrl = res.locals.redirectUrl || "/listings";
  delete req.session.redirectUrl; // clean up session
  req.flash("success", "Welcome back!");
  res.redirect(redirectUrl);
};

//Logout
module.exports.logout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
