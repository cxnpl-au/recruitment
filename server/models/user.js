const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Contributor", "Viewer"],
    required: true,
  },
  organisation: {
    type: Schema.Types.ObjectId,
    ref: "Organisation",
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Account already exists, please login."],
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
