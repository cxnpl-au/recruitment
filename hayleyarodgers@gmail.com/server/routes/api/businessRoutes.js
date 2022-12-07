// Use Express router
const router = require("express").Router();

// Get logic to execute routes
const {
	getBusiness,
	createBusiness,
	deleteBusiness,
	getAccount,
	createAccount,
	updateAccount,
	deleteAccount,
	getTeam,
} = require("../../controllers/businessController");

// Import authorisation middleware
const {
	authUser,
	authCreateAccount,
	authUpdateAccount,
	authDeleteAccount,
	authDeleteBusiness,
	authGetTeam,
} = require("../../utils/auth");

// /api/businesses
router.route("/").post(createBusiness);

// /api/businesses/:businessId
router
	.route("/:businessId")
	.get(authUser, getBusiness)
	.delete(authUser, authDeleteBusiness, deleteBusiness);

// /api/businesses/:businessId/accounts
router
	.route("/:businessId/accounts")
	.post(authUser, authCreateAccount, createAccount);

// /api/businesses/:businessId/accounts/:accountId
router
	.route("/:businessId/accounts/:accountId")
	.get(authUser, getAccount)
	.put(authUser, authUpdateAccount, updateAccount)
	.delete(authUser, authDeleteAccount, deleteAccount);

// /api/businesses/:businessId/admin
router.route("/:businessId/admin").get(authUser, authGetTeam, getTeam);

module.exports = router;
