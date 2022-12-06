// Use Express router
const router = require("express").Router();

// Get logic to execute routes
const { signupUser, loginUser } = require("../../controllers/userController");

// /api/users
router.route("/").post(signupUser);

// /api/users/login
router.route("/login").post(loginUser);

module.exports = router;
