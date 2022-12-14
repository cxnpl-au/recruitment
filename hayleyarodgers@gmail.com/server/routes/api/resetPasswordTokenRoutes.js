// Use Express router
const router = require("express").Router();

// Get logic to execute routes
const {
	resetPasswordRequestController,
	resetPasswordController,
} = require("../../controllers/resetPasswordTokenController");

// /api/resetpassword/request
router.post("/request", resetPasswordRequestController);

// /api/resetpassword
router.post("/", resetPasswordController);

module.exports = router;
