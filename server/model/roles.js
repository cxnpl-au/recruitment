const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  roleName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    match: /^[a-zA-Z0-9]+$/,
  },
  description: {
    type: String,
    required: true,
  },
  permissions: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Role", roleSchema);
