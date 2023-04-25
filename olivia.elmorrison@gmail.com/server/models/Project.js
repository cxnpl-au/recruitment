const { Schema } = require("mongoose");

const projectSchema = new Schema({
    name: {
		type: String,
		required: true,
		trim: true,
	},
	estimate: {
		type: Number,
		required: true,
	},
	expense: {
		type: Number,
		required: true,
	}
});

module.exports = projectSchema;