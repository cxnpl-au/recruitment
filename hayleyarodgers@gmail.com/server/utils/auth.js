// Use JSON web tokens for authentication
const jwt = require("jsonwebtoken");

// Set token secret and expiration date
const secret = "mysecretsshhhhh"; // replace with .env variable in the future
const expiration = "2h";

module.exports = {
	// Authorisation middleware that verifies whether user has a valid token, ie. logged in and 2h session hasn't expired
	authUser: function (req, res, next) {
		// Allows token to be sent via req.query or headers
		let token = req.query.token || req.headers.authorization;

		// Split the token string into an array and return the actual token
		// ["Bearer", "<tokenvalue>"]
		if (req.headers.authorization) {
			token = token.split(" ").pop().trim();
		}

		if (!token) {
			return res.status(401).json({ message: "You have no token." });
		}

		// If the token can be verified, add the decoded user's data to the request
		try {
			const { data } = jwt.verify(token, secret, { maxAge: expiration });
			req.user = data;
		} catch {
			return res.status(401).json({ message: "Your token is invalid." });
		}

		// Send to next endpoint
		next();
	},
	// Authorisation middleware that verifies whether user has specified role
	authRole: function (role) {
		return (req, res, next) => {
			// Allows token to be sent via req.query or headers
			let token = req.query.token || req.headers.authorization;

			// Split the token string into an array and return the actual token
			// ["Bearer", "<tokenvalue>"]
			if (req.headers.authorization) {
				token = token.split(" ").pop().trim();
			}

			if (token.role !== role) {
				return res
					.status(403)
					.json({ message: "You aren't authorised to make this request." });
			}

			// Send to next endpoint
			next();
		};
	},
	// Upon sign up or log in, generate and sign token to be used for authorisation
	signToken: function ({ username, email, role, _id }) {
		const payload = { username, email, role, _id };

		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
};
