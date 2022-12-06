const { Schema, model } = require("mongoose");
const accountSchema = require("./Account");

// Schema to create Business model
const businessSchema = new Schema(
	{
		name: {
			type: String,
			required: "Your business needs a name.",
			unique: true,
			trim: true,
		},
		// Array of account subdocuments
		accounts: [accountSchema],
		// Array of ids of people registered under the business
		// One-to-many relationship
		team: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	// Allow use of virtuals below
	{
		toJSON: {
			virtuals: true,
		},
	}
);

// Create a virtual property "totalBalance" that gets the total sum of all of the business' account balances
businessSchema.virtual("totalBalance").get(function () {
	const totalBalance = [0];

	for (let i = 0; i < this.accounts.length; i++) {
		totalBalance.push(this.accounts[i].balance);
	}

	const getSum = (total, num) => {
		return total + num;
	};

	return totalBalance.reduce(getSum);
});

// Initialise User model
const Business = model("Business", businessSchema);

module.exports = Business;
