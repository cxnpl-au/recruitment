const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // add id
  name: {
    type: String,
    required: true,
  },
  // add in validation for roles
  // privileged access
  role: {
    type: String,
    enum: ["Admin", "Basic"],
    description: "Invalid role",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
// can add validation here too

module.exports = mongoose.model("User", UserSchema);
