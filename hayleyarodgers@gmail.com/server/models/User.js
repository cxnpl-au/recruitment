const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// Schema to create User model
const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		// Use regex to validate email
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"Please use a valid email address.",
		],
	},
	password: {
		type: String,
		required: true,
	},
	// Role used to manage a user's permissions
	role: {
		type: String,
		enum: ["admin", "editor", "viewer"],
	},
});

// Use bcrypt to hash user's password
// This means the user's password is saved in the database in a different format to what it was entered to increase security
userSchema.pre("save", async function (next) {
	if (this.isNew || this.isModified("password")) {
		const saltRounds = 10;
		this.password = await bcrypt.hash(this.password, saltRounds);
	}

	next();
});

// Custom method to compare and validate password when user logs in
userSchema.methods.isCorrectPassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

// Initialise User model
const User = model("User", userSchema);

module.exports = User;
