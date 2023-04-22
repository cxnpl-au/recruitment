const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
    permissions: {
        type: String,
        enum: ["ADMIN", "APPROVER", "SUBSCRIBER", "NONE"],
        default: "NONE"
    }
});

module.exports = mongoose.model('User', userSchema);