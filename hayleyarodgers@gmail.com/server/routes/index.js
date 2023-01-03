// Use Express router
const router = require("express").Router();

// Specify API in route path
const apiRoutes = require("./api");
router.use("/api", apiRoutes);

// Serve up React front-end in production
const path = require("path");

router.use((req, res) => {
	res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

module.exports = router;
