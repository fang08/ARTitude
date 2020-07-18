const express = require("express");
const router = express.Router();
const Artwork = require("../models/artwork");
const middleware = require("../middleware");

// INDEX of artworks
router.get("/", (req, res) => {
  Artwork.find({}, (err, allArtworks) => {
    if(err) {
      console.log(err);
    }
    else {
      // console.log(allArtworks);
      res.render("artworks/index", {artworks: allArtworks});
    }
  });
});

// NEW for artworks
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("artworks/new");
});

// CREATE new artwork
router.post("/", middleware.isLoggedIn, (req, res) => {
  let name = req.body.artwork.name;
  let image = req.body.artwork.image;
  let description = req.body.artwork.description;
  let painter = req.body.artwork.painter;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  Artwork.create({name, image, description, painter, author}, (err, newArtwork) => {
    if(err) {
      console.log(err);
    }
    else {
      // console.log(newArtwork);
      // newArtwork.save();
      res.redirect("/artworks");
    }
  });
});

// SHOW all artwork
router.get("/:id", (req, res) => {
  Artwork.findById(req.params.id).populate("comments").exec((err, foundArtwork) => {
    if(err || !foundArtwork) {
      req.flash("error", "Artwork not found!");
      res.redirect("/artworks");
    }
    else {
      // console.log(foundArtwork);
      res.render("artworks/show", {artworks: foundArtwork});
    }
  });
});

// EDIT artwork
router.get("/:id/edit", middleware.checkArtworkOwnership, (req, res) => {
  Artwork.findById(req.params.id, (err, foundArtwork) => {
    res.render("artworks/edit", {artwork: foundArtwork});
  });
});

// UPDATE artwork
router.put("/:id", middleware.checkArtworkOwnership, (req, res) => {
  Artwork.findByIdAndUpdate(req.params.id, req.body.artwork, (err, updatedArtwork) => {
    if(err) {
      res.redirect("/artworks");
    }
    else {
      res.redirect(`/artworks/${req.params.id}`);
    }
  });
});

// DESTROY artwork
router.delete("/:id", middleware.checkArtworkOwnership, (req, res) => {
  Artwork.findByIdAndRemove(req.params.id, err => {
    if(err) {
      res.redirect("/artworks");
    }
    else {
      res.redirect("/artworks");
    }
  });
});

module.exports = router;