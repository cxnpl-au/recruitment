// Use Express router
const router = require("express").Router();

// Get logic to execute routes
const {
	getBusiness,
	createBusiness,
	deleteBusiness,
	getAccounts,
	createAccount,
	updateAccount,
	deleteAccount,
} = require("../../controllers/businessController");

// Import authorisation middleware
const {
	authUser,
	authCreateAccount,
	authUpdateAccount,
	authDeleteAccount,
	authDeleteBusiness,
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
	.get(authUser, getAccounts)
	.post(authUser, authCreateAccount, createAccount);

// /api/businesses/:businessId/accounts/:accountId
router
	.route("/:businessId/accounts/:accountId")
	.put(authUser, authUpdateAccount, updateAccount)
	.delete(authUser, authDeleteAccount, deleteAccount);

module.exports = router;
