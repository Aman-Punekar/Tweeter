const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  tweet: String,
  likes: {
    num: Number,
    likedBy: [String],  // references id
  },
  dislikes: {
    num: Number,
    dislikedBy: [String], // references id
  },
  comments: [
    {
      comment: String,
      commentedBy: String,  // references id
    },
  ],
});

module.exports = mongoose.model("Tweet", tweetSchema);
