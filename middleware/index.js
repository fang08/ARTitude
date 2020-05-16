const middlewareObj = {};
const Campground = require("../models/campground");
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

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if(req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err || !foundCampground) {
        req.flash("error", "Campground not found!");
        res.redirect("back");
      }
      else {
        if(foundCampground.author.id.equals(req.user._id)) {
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