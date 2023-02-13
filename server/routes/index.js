const express = require("express");
const users = require("./userRoutes");
const orgs = require("./organisationRoutes");
const router = express.Router();

router.use(users);
router.use(orgs);

module.exports = router;
