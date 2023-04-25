const { Schema, model } = require('mongoose');
const projectSchema = require("./Project");

const businessSchema = new Schema({
    name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	team: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
	projects: [projectSchema]
});

module.exports = model('Business', businessSchema);