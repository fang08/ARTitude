const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

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
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// CREATE new campground
router.post("/", middleware.isLoggedIn, (req, res) => {
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
    if(err || !foundCampground) {
      req.flash("error", "Campground not found!");
      res.redirect("/campgrounds");
    }
    else {
      // console.log(foundCampground);
      res.render("campgrounds/show", {campgrounds: foundCampground});
    }
  });
});

// EDIT campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});

// UPDATE campground
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
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
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if(err) {
      res.redirect("/campgrounds");
    }
    else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;