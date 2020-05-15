const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

// INDEX of campgrounds
router.get("/", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if(err) {
      console.log(err);
    }
    else {
      // console.log(allCampgrounds);
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

// NEW for campgrounds
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// CREATE new campground
router.post("/", isLoggedIn, (req, res) => {
  let name = req.body.campground.name;
  let image = req.body.campground.image;
  let description = req.body.campground.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  Campground.create({name, image, description, author}, (err, newCampground) => {
    if(err) {
      console.log(err);
    }
    else {
      // console.log(newCampground);
      // newCampground.save();
      res.redirect("/campgrounds");
    }
  });
});

// SHOW all campgrounds
router.get("/:id", (req, res) => {
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

// EDIT campground
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});

// UPDATE campground
router.put("/:id", checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if(err) {
      res.redirect("/campgrounds");
    }
    else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// DESTROY campground
router.delete("/:id", checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if(err) {
      res.redirect("/campgrounds");
    }
    else {
      res.redirect("/campgrounds");
    }
  });
});

// middleware, check whether a user has logged in or not
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
  if(req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err) {
        res.redirect("back");
      }
      else {
        if(foundCampground.author.id.equals(req.user._id)) {
          next();
        }
        else {
          res.redirect("back");
        }
      }
    });
  }
  else {
    res.redirect("back");
  }
}

module.exports = router;