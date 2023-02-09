const mongoose = require("mongoose");

const OrganisationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Organisation", OrganisationSchema);
