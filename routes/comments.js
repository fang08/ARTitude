const express = require("express");
const router = express.Router({mergeParams: true});
const Artwork = require("../models/artwork");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// NEW for comments
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Artwork.findById(req.params.id, (err, artwork) => {
    if(err) {
      console.log(err);
    }
    else {
      res.render("comments/new", {artwork: artwork});
    }
  });
});

// CREATE new comment
router.post("/", middleware.isLoggedIn, (req, res) => {
  Artwork.findById(req.params.id, (err, artwork) => {
    if(err) {
      console.log(err);
      res.redirect("/artworks");
    }
    else {
      Comment.create(req.body.comment, (err, newComment) => {
        if(err) {
          console.log(err);
        }
        else {
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          newComment.save();
          artwork.comments.push(newComment);
          artwork.save();
          req.flash("success", "Successfully added a comment!");
          res.redirect(`/artworks/${artwork._id}`);
        }
      });
    }
  });
});

// EDIT comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Artwork.findById(req.params.id, (err, foundArtwork) => {
    if(err || !foundArtwork) {
      req.flash("error", "No artwork found!");
      return res.redirect("back");
    }
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err) {
        res.redirect("back");
      }
      else {
        res.render("comments/edit", {artwork_id: req.params.id, comment: foundComment});
      }
    });
  });
});

// UPDATE comments
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if(err) {
      res.redirect("back");
    }
    else {
      res.redirect(`/artworks/${req.params.id}`);
    }
  });
});

// DESTROY comments
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if(err) {
      res.redirect("back");
    }
    else {
      req.flash("success", "comment deleted.");
      res.redirect(`/artworks/${req.params.id}`);
    }
  });
});

module.exports = router;