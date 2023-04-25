const { Schema, model } = require('mongoose');

const userSchema = new Schema({
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
    },
	businessId: {
		type: Schema.Types.ObjectId,
		ref: "Business",
	}
});

module.exports = model('User', userSchema);