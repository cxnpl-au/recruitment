const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

// Create transporter
const transporter = nodemailer.createTransport({
	service: "hotmail",
	auth: {
		user: process.env.MAIL_USERNAME,
		pass: process.env.MAIL_PASSWORD,
	},
});

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
	transporter.use("compile", hbs(handlebarOptions));

	// Define mail options
	const mailOptions = {
		from: process.env.MAIL_USERNAME,
		to: email,
		subject: "Reset password for hayleyarodgers technical assessment",
		template: "requestResetPassword",
		context: {
			name: name,
			link: link,
		},
	};

	// calls sendMail function with mail options defined
	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
};

module.exports = resetPasswordEmail;
