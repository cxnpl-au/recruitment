const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// Create a new refresh token for each request
const createTransporter = async () => {
	const oauth2Client = new OAuth2(
		process.env.OAUTH_CLIENTID,
		process.env.OAUTH_CLIENT_SECRET,
		"https://developers.google.com/oauthplayground"
	);

	oauth2Client.setCredentials({
		refresh_token: process.env.OAUTH_REFRESH_TOKEN,
	});

	const accessToken = await new Promise((resolve, reject) => {
		oauth2Client.getAccessToken((err, token) => {
			if (err) {
				reject("Failed to create access token :(");
			}
			resolve(token);
		});
	});

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user: process.env.MAIL_USERNAME,
			accessToken,
			clientId: process.env.OAUTH_CLIENTID,
			clientSecret: process.env.OAUTH_CLIENT_SECRET,
			refreshToken: process.env.OAUTH_REFRESH_TOKEN,
		},
	});

	return transporter;
};

// Define handlebars options
const handlebarOptions = {
	viewEngine: {
		extName: ".handlebars",
		partialsDir: path.resolve(
			".hayleyarodgers@gmail.com/server/utils/email/template"
		),
		defaultLayout: false,
	},
	viewPath: path.resolve("./utils/email/template"),
	extName: ".handlebars",
};

// Define reset password request email
const resetPasswordEmail = async (email, name, link) => {
	let emailTransporter = await createTransporter();

	emailTransporter.use("compile", hbs(handlebarOptions));

	// Define mail options
	const mailOptions = {
		from: process.env.MAIL_USERNAME,
		to: email,
		subject: "Reset password for hayleyarodgers x cxnpl technical assessment",
		template: "requestResetPassword",
		context: {
			name: name,
			link: link,
		},
	};

	// calls sendMail function with mail options defined
	emailTransporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
};

module.exports = resetPasswordEmail;
