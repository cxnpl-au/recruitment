// Use Express router
const router = require("express").Router();

// Further specify route path
const userRoutes = require("./userRoutes");
const businessRoutes = require("./businessRoutes");
const resetPasswordTokenRoutes = require("./resetPasswordTokenRoutes");

router.use("/users", userRoutes);
router.use("/businesses", businessRoutes);
router.use("/resetpassword", resetPasswordTokenRoutes);

module.exports = router;
