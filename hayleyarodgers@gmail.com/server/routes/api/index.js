// Use Express router
const router = require("express").Router();

// Further specify route path
const userRoutes = require("./userRoutes");
const businessRoutes = require("./businessRoutes");

router.use("/users", userRoutes);
router.use("/business", businessRoutes);

module.exports = router;
