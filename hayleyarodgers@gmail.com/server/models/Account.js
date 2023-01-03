const { Schema } = require("mongoose");

// Schema to create the account field's subdocument schema in the Business model
const accountSchema = new Schema({
	name: {
		type: String,
		required: "Your account needs a name.",
		trim: true,
	},
	balance: {
		type: Number,
		required: "Your account needs a balance.",
	},
});

module.exports = accountSchema;
