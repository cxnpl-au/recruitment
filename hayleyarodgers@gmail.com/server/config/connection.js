const mongoose = require("mongoose");

// If application is running on Heroku, connect to MongoDB database hosted online via config variable
// If application is running on localHost, connect to MongoDB database hosted locally
mongoose.connect(
	process.env.MONGODB_URI || "mongodb://localhost:27017/bankDB",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

module.exports = mongoose.connection;
