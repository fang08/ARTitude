const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// root route
router.get("/", (req, res) => {
  res.render("landing");
});

// NEW register form
router.get("/register", (req, res) => {
  res.render("register");
});

// CREATE new user
router.post("/register", (req, res) => {
  let newUser = new User({username: req.body.username});  // only user name, not password
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    });
  });
});

// SHOW login form
router.get("/login", (req, res) => {
  res.render("login");
});

// handle login
router.post("/login", 
  passport.authenticate("local", 
  { successRedirect: "/campgrounds", failureRedirect: "/login"}),
  (req, res) => {
});

// logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;