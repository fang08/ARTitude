const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  painter: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model('Artwork', artworkSchema);