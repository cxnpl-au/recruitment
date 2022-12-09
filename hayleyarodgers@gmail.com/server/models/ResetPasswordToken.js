const { Schema, model } = require("mongoose");

const resetPasswordTokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		expires: 900,
	},
});

// Initialise ResetPasswordToken model
const ResetPasswordToken = model(
	"ResetPasswordToken",
	resetPasswordTokenSchema
);

module.exports = ResetPasswordToken;
