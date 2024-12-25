const mongoose = require("mongoose");

const getRandomProfilePicture = `avatar.png`;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
  },
  avatarImage: {
    type: String,
    default: getRandomProfilePicture,
  },
},{
  timestamps:true
});

module.exports = mongoose.model("users", userSchema);
