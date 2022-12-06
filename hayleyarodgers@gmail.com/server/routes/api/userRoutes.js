// Use Express router
const router = require("express").Router();

// Get logic to execute routes
const {
	signupUser,
	loginUser,
	getUsers,
} = require("../../controllers/userController");

// Import authorisation middleware
const { authUser, authGetUsers } = require("../../utils/auth");

// /api/users
router.route("/").post(signupUser);

// /api/users/login
router.route("/login").post(loginUser);

// /api/users/admin
router.route("/admin").get(authUser, authGetUsers, getUsers);

module.exports = router;
