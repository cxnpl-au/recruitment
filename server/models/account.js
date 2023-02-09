const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  // add id
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
  },
});
// can add validation here too

module.exports = mongoose.model("Account", AccountSchema);
