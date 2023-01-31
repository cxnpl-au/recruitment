const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  // add id
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  mobile: {
    type: String,
  },
  accountBalance: {
    type: Number,
  },
});
// can add validation here too

module.exports = mongoose.model("Customer", CustomerSchema);
