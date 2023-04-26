const jwt = require('jsonwebtoken');

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const {
    updateUserPermissions,
    getTeam,
    createProject,
    updateProject
} = require("./authPolicy");

//TODO: update
const secret = "b09df586-5363-4a2d-8494-7394010e9e49"
const expiration = "2h";

module.exports = {
	
	authUser: function (req, res) {
		let token = req.headers.token;

		if (!token) {
			return res.status(401).json({ message: "No token supplied" });
		}

		try {
			const { data } = jwt.verify(token, secret, { maxAge: expiration });
			req.user = data;
		} catch {
			return res.status(401).json({ message: "Token is invalid." });
		}
	},

	authGetTeam: function (req, res) {

		if (!getTeam(req.user.permissions)) {
			return res
				.status(403)
				.json({ message: "Not authorised to make this request." });
		}
	},

	authCreateProject: function (req, res) {
		if (!createProject(req.user.permissions)) {
			return res
				.status(403)
				.json({ message: "Not authorised to make this request." });
		}	
	},

	authUpdateProject: function (req, res) {

		if (!updateProject(req.user.permissions)) {
			return res
				.status(403)
				.json({ message: "You aren't authorised to make this request." });
		}
	},
	authUpdateUserPermissions: function (req, res) {

		if (!updateUserPermissions(req.user.permissions)) {
			return res
				.status(403)
				.json({ message: "You aren't authorised to make this request." });
		}
	},
	signToken: function ({ username, email, permissions, business, _id }) {
		const payload = { username, email, permissions, business, _id };
	
		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	}
};