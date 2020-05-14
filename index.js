const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seed");

const port = 3000;

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

seedDB();

// passport config
app.use(require("express-session")({
  secret: "THISISARANDOMSECRET",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// ==============
// Routes
// ==============

app.get("/", (req, res) => {
  res.render("landing");
});

// INDEX of campgrounds
app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if(err) {
      console.log(err);
    }
    else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

// NEW for campgrounds
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// CREATE new campground
app.post("/campgrounds", (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  Campground.create({name, image, description}, (err, newCampground) => {
    if(err) {
      console.log(err);
    }
    else {
      res.redirect("/campgrounds");
    }
  });
});

// SHOW all campgrounds
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if(err) {
      console.log(err);
    }
    else {
      // console.log(foundCampground);
      res.render("campgrounds/show", {campgrounds: foundCampground});
    }
  });
});


// NEW for comments
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
    }
    else {
      res.render("comments/new", {campground: campground});
    }
  });
});

// CREATE new comment
app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
      res.redirect("/campgrounds");
    }
    else {
      Comment.create(req.body.comment, (err, newComment) => {
        if(err) {
          console.log(err);
        }
        else {
          campground.comments.push(newComment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});


// NEW register form
app.get("/register", (req, res) => {
  res.render("register");
});

// CREATE new user
app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
  res.render("login");
});

// handle login
app.post("/login", 
  passport.authenticate("local", 
  { successRedirect: "/campgrounds", failureRedirect: "/login"}),
  (req, res) => {
});

// logout
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// middleware, check whether a user has logged in or not
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));