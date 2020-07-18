const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const methodOverride = require("method-override");

const artworkRoutes = require("./routes/artworks");
const commentRoutes = require("./routes/comments");
const authRoutes = require("./routes/auth");

const Artwork = require("./models/artwork");
const Comment = require("./models/comment");
const User = require("./models/user");
// const seedDB = require("./seed");

const port = 80;

mongoose.connect("mongodb+srv://admin:adminpassword@projects.lbf5z.mongodb.net/", {dbName: 'artitude', useNewUrlParser: true, useUnifiedTopology: true})
  .catch((err) => {
    console.error("Error connecting database ", err);
  });
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");

mongoose.set('useFindAndModify', false);

// seedDB();

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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(authRoutes);
app.use("/artworks",artworkRoutes);
app.use("/artworks/:id/comments", commentRoutes);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));