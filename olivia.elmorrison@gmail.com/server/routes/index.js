const router = require("express").Router();

const userRoutes = require("./UserRoutes");
const businessRoutes = require("./BusinessRoutes");

router.use("/users", userRoutes);
router.use("/business", businessRoutes);

module.exports = router;