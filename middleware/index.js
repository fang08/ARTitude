const middlewareObj = {};
const Artwork = require("../models/artwork");
const Comment = require("../models/comment");

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please login first!");
  res.redirect("/login");
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err || !foundComment) {
        req.flash("error", "Comment not found!");
        res.redirect("back");
      }
      else {
        if(foundComment.author.id.equals(req.user._id)) {
          next();
        }
        else {
          req.flash("error", "You don't have the permissions to do that.");
          res.redirect("back");
        }
      }
    });
  }
  else {
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("back");
  }
}

middlewareObj.checkArtworkOwnership = (req, res, next) => {
  if(req.isAuthenticated()) {
    Artwork.findById(req.params.id, (err, foundArtwork) => {
      if(err || !foundArtwork) {
        req.flash("error", "Artwork not found!");
        res.redirect("back");
      }
      else {
        if(foundArtwork.author.id.equals(req.user._id)) {
          next();
        }
        else {
          req.flash("error", "You don't have the permissions to do that.");
          res.redirect("back");
        }
      }
    });
  }
  else {
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("back");
  }
}

module.exports = middlewareObj;