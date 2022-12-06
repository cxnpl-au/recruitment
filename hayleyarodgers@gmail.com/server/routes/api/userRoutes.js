// Use Express router
const router = require("express").Router();

// Get logic to execute routes
const {
	signupUser,
	loginUser,
	getAllUsers,
} = require("../../controllers/userController");

// Import authorisation middleware
// authUser is used to verify that the user is logged in
// authRole is used to verify that the user has a particular role
const { authUser, authRole } = require("../../utils/auth");

// /api/users
router.route("/").post(signupUser);

// /api/users/login
router.route("/login").post(loginUser);

// /api/users/myprojects
router.route("/myteam").get(authUser, authRole("admin"), getAllUsers);

module.exports = router;
