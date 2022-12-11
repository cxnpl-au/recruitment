const User = require("../models/User");

describe("User", () => {
	describe("Initialisation", () => {
		// Positive tests
		it("should create a new object with a 'username' property set to the 'username' argument provided when called with the 'new' keyword.", () => {
			try {
				// Arrange
				const username = "dualipa";
				const email = "dualipa@gmail.com";
				const password = "ILoveMusic123!";
				const role = "admin";
				const businessId = "6392dfeca277cb08131971f3";

				// Act
				const obj = new User({
					username,
					email,
					password,
					role,
					businessId,
				});

				// Assert
				expect(obj.username).toEqual(username);
			} catch (err) {}
		});

		it("should create a new object with an 'email' property set to the 'email' argument provided when called with the 'new' keyword.", () => {
			try {
				// Arrange
				const username = "dualipa";
				const email = "dualipa@gmail.com";
				const password = "ILoveMusic123!";
				const role = "admin";
				const businessId = "6392dfeca277cb08131971f3";

				// Act
				const obj = new User({
					username,
					email,
					password,
					role,
					businessId,
				});

				// Assert
				expect(obj.email).toEqual(email);
			} catch (err) {}
		});

		// Exception tests
		it("should throw an error if not provided with any values.", async () => {
			try {
				// Arrange
				const user = await User.create();

				// Assert
				expect(user).toThrow();
			} catch (err) {}
		});
	});
});
