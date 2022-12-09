const User = require("../models/User");
const ResetPasswordToken = require("../models/ResetPasswordToken");

const resetPasswordEmail = require("./email/sendEmail");

const crypto = require("crypto");
const bcrypt = require("bcrypt");

// Use dotenv to store url
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const clientURL = process.env.CLIENT_URL;

const requestPasswordReset = async (email) => {
	const user = await User.findOne({ email });
	if (!user) throw new Error("No user found with that email.");

	let token = await ResetPasswordToken.findOne({ userId: user._id });
	if (token) await token.deleteOne();

	let resetToken = crypto.randomBytes(32).toString("hex");
	const hash = await bcrypt.hash(resetToken, Number(10));

	await new ResetPasswordToken({
		userId: user._id,
		token: hash,
		createdAt: Date.now(),
	}).save();

	const link = `${clientURL}/passwordreset?token=${resetToken}&id=${user._id}`;

	resetPasswordEmail(user.email, user.username, link);

	return link;
};

const resetPassword = async (userId, token, password) => {
	let resetPasswordToken = await ResetPasswordToken.findOne({ userId });

	if (!resetPasswordToken) {
		throw new Error("Invalid or expired password reset token.");
	}

	const isValid = await bcrypt.compare(token, resetPasswordToken.token);

	if (!isValid) {
		throw new Error("Invalid or expired password reset token.");
	}

	const hash = await bcrypt.hash(password, Number(10));

	await User.updateOne(
		{ _id: userId },
		{ $set: { password: hash } },
		{ new: true }
	);

	await resetPasswordToken.deleteOne();

	return true;
};

module.exports = {
	requestPasswordReset,
	resetPassword,
};
