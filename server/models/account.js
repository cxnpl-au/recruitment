const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const AccountSchema = new mongoose.Schema({
  // add id
  organisation: {
    type: Schema.Types.ObjectId,
    ref: "Organisation",
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
});
// can add validation here too

module.exports = mongoose.model("Account", AccountSchema);
