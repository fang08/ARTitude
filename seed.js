const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");


let seeds = [
  {name: "Salmon Creek", image: "https://tpwd.texas.gov/state-parks/park-information/facilities/campsites/tpw_tof_003_800p.jpg",
  description: "This is Salmon Creek. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo officiis, officia eius quisquam debitis optio mollitia porro aliquam provident dolore."},
  {name: "High land", image: "https://cdn.vox-cdn.com/thumbor/FMUIaXcnBaKK9YqdP8qtxUog150=/0x0:4741x3161/1200x800/filters:focal(1992x1202:2750x1960)/cdn.vox-cdn.com/uploads/chorus_image/image/59535149/shutterstock_625918454.0.jpg",
  description: "This place has a very good view of sky. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo officiis, officia eius quisquam debitis optio mollitia porro aliquam provident dolore."},
  {name: "Cloud's Rest", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTKTo0p0ENNBJBwTTzZ42qx2FhImZX_ocZzcx7tytRQkKjZTOZq&usqp=CAU",
  description: "Something good about this place. Come and visit! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo officiis, officia eius quisquam debitis optio mollitia porro aliquam provident dolore."}
];


async function seedDB() {
  await Comment.deleteMany({});
  await Campground.deleteMany({});
  for(const seed of seeds) {
    let campground = await Campground.create(seed);
    let comment = await Comment.create({text: "this place is great, but I wish there was internet.", author: "Homer"});
    campground.comments.push(comment);
    campground.save();
  }
}

module.exports = seedDB;