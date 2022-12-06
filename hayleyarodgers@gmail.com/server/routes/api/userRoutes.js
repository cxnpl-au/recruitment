// Use Express router
const router = require("express").Router();

// Get logic to execute routes
const {
	signupUser,
	loginUser,
	createUser,
} = require("../../controllers/userController");

// /api/users
router.route("/").post(signupUser);

// /api/users/login
router.route("/login").post(loginUser);

// /api/users/create
router.route("/create").post(createUser);

module.exports = router;
