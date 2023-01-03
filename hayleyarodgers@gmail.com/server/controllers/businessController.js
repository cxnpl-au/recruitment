// Import Business model
const { Business } = require("../models");

module.exports = {
	// Get a business by its id
	async getBusiness({ params }, res) {
		try {
			const business = await Business.findOne({
				_id: params.businessId,
			}).populate("accounts");

			if (!business) {
				return res
					.status(400)
					.json({ message: "No business found with that id." });
			}

			res.status(200).json(business);
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},

	// Create business
	async createBusiness({ body }, res) {
		try {
			const business = await Business.create(body);

			if (!business) {
				return res.status(400).json({ message: "Unable to create business." });
			}

			res.status(200).json(business);
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},

	// Delete business
	async deleteBusiness({ params }, res) {
		try {
			const business = await Business.findOneAndDelete({
				_id: params.businessId,
			});

			if (!business) {
				return res.status(400).json({ message: "Unable to delete business." });
			}

			res.status(200).json({ message: "Business deleted." });
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},

	// Get an account by its id
	async getAccount({ params }, res) {
		try {
			const businessData = await Business.findOne({ _id: params.businessId });
			const account = businessData.accounts.id(params.accountId);

			if (!account) {
				return res
					.status(400)
					.json({ message: "No account found with that id." });
			}

			res.status(200).json(account);
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},

	// Add account to business
	async createAccount({ body, params }, res) {
		try {
			const business = await Business.findOneAndUpdate(
				{ _id: params.businessId },
				{ $push: { accounts: body } },
				{ runValidators: true, new: true }
			);

			if (!business) {
				return res.status(400).json({ message: "Unable to create account." });
			}

			res.status(200).json(business);
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},

	// Update account in business
	async updateAccount({ body, params }, res) {
		try {
			// Get current account data
			const businessData = await Business.findOne({ _id: params.businessId });
			const account = businessData.accounts.id(params.accountId);

			// Rewrite account data with changes applied
			const updatedAccount = { ...account.toJSON(), ...body };

			// Save updated account data to business
			const business = await Business.findOneAndUpdate(
				{ _id: params.businessId, "accounts._id": params.accountId },
				{ $set: { "accounts.$": updatedAccount } },
				{ runValidators: true, new: true }
			);

			if (!business) {
				return res.status(400).json({ message: "Unable to update account." });
			}

			res.status(200).json(business);
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},

	// Delete account in business
	async deleteAccount({ params }, res) {
		try {
			const business = await Business.findOneAndUpdate(
				{ _id: params.businessId },
				{ $pull: { accounts: { _id: params.accountId } } },
				{ new: true }
			);

			if (!business) {
				return res.status(400).json({ message: "Unable to delete account." });
			}

			res.status(200).json({ message: "Account deleted." });
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},

	// Get all users registered as part of a business
	async getTeam({ params }, res) {
		try {
			const business = await Business.findOne({
				_id: params.businessId,
			}).populate({
				path: "team",
			});
			const team = business.team;

			if (!team) {
				return res.status(400).json({ message: "Unable to get team." });
			}

			res.status(200).json(team);
		} catch (err) {
			console.error(err);
			res.status(500);
		}
	},
};
