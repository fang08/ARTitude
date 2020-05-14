const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seed");
const port = 3000;

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

seedDB();

// routes
app.get("/", (req, res) => {
  res.render("landing");
});

// INDEX
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
app.get("/campgrounds/:id/comments/new", (req, res) => {
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
app.post("/campgrounds/:id/comments", (req, res) => {
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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));