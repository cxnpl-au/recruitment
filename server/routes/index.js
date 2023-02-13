const express = require("express");
const users = require("./userRoutes");
const orgs = require("./organisationRoutes");
const accounts = require("./accountRoutes");
const router = express.Router();

router.use(users);
router.use(orgs);
router.use(accounts);

module.exports = router;
