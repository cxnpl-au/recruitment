const express = require("express");
const users = require("./userRoutes")
const router = express.Router()

router.use(users)

module.exports = router;