// Import User and Business models
const { User, Business } = require("../models");
// Import sign token function from auth
const { signToken } = require("../utils/auth");

module.exports = {
	// Upon sign up, create a user, sign a token and send it back to client/src/components/SignUpForm.js
	async signupUser({ body }, res) {
		try {
			const user = await User.create(body);

			if (!user) {
				return res.status(400).json({ message: "Unable to create new user." });
			}

			// Add user to list of those registered under the business
			const business = await Business.findOneAndUpdate(
				{ _id: user.businessId },
				{ $addToSet: { team: user._id } },
				{ new: true }
			);

			if (!business) {
				return res
					.status(400)
					.json({ message: "User created but not linked to business." });
			}

			const token = signToken(user);
			res.status(200).json({ token, user });
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},

	// Upon log in, log in the user based on username, sign a token and send it back to client/src/components/LoginForm.js
	async loginUser({ body }, res) {
		try {
			const user = await User.findOne({ username: body.username });

			if (!user) {
				return res.status(400).json({
					message: "Unable to find user with this username.",
				});
			}

			// Check password
			const correctPw = await user.isCorrectPassword(body.password);

			if (!correctPw) {
				return res.status(400).json({ message: "Wrong password." });
			}

			const token = signToken(user);
			res.status(200).json({ token, user });
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},

	// Get a user by their id
	async getUser({ params }, res) {
		try {
			const user = await User.findOne({ _id: params.userId });

			if (!user) {
				return res.status(400).json({ message: "No user with that id." });
			}

			res.status(200).json(user);
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},

	// During provisioning, admin can create user profiles for the people in the business
	async createUser({ body }, res) {
		try {
			const user = await User.create(body);

			if (!user) {
				return res.status(400).json({ message: "Unable to create new user." });
			}

			// Add user to list of those registered under the business
			const business = await Business.findOneAndUpdate(
				{ _id: user.businessId },
				{ $addToSet: { team: user._id } },
				{ new: true }
			);

			if (!business) {
				return res
					.status(400)
					.json({ message: "User created but not linked to business." });
			}

			res.status(200).json(user);
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},

	// Admin can update users, eg. change their permissions
	async updateUser({ body, params }, res) {
		try {
			const user = await User.findOneAndUpdate(
				{ _id: params.userId },
				{ $set: body },
				{ runValidators: true, new: true }
			);

			if (!user) {
				return res.status(400).json({ message: "Unable to update user." });
			}

			res.status(200).json(user);
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},

	// Admin can delete users, eg. if they leave the business
	async deleteUser({ params }, res) {
		try {
			const user = await User.findOneAndDelete({
				_id: params.userId,
			});

			if (!user) {
				return res.status(400).json({ message: "Unable to delete user." });
			}

			res.status(200).json({ message: "User deleted." });
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},
};
