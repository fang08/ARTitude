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
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

// NEW for campgrounds
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

// CREATE new campground
router.post("/", (req, res) => {
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

module.exports = router;