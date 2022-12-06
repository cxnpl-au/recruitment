// Use Express router
const router = require("express").Router();

// Get logic to execute routes
const {
	signupUser,
	loginUser,
	createUser,
	updateUser,
	deleteUser,
} = require("../../controllers/userController");

// Import authorisation middleware
const {
	authUser,
	authCreateUser,
	authUpdateUser,
	authDeleteUser,
} = require("../../utils/auth");

// /api/users
router.route("/").post(signupUser);

// /api/users/login
router.route("/login").post(loginUser);

// /api/users/manage
router.route("/manage").post(authUser, authCreateUser, createUser);

// /api/users/manage/:userId
router
	.route("/manage/:userId")
	.put(authUser, authUpdateUser, updateUser)
	.delete(authUser, authDeleteUser, deleteUser);

module.exports = router;
