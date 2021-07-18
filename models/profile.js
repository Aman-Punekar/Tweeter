const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  username: {
    type : String,
    unique : true
  },
  email: {
    type : String,
    unique : true
  },
  credentials: {
    salt: String,
    hash: String,
  },
  tweets: [String]  // references tweets
});

module.exports = mongoose.model("Profile", profileSchema);
