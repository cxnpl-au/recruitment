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
			} catch (err) {
				throw new Error(err);
			}
		});

		// 	it("should create a new object with an 'email' property set to the 'email' argument provided when called with the 'new' keyword.", () => {
		// 		try {
		// 			// Arrange
		// 			const username = "dualipa";
		// 			const email = "dualipa@gmail.com";
		// 			const password = "ILoveMusic123!";
		// 			const role = "admin";
		// 			const businessId = "6392dfeca277cb08131971f3";

		// 			// Act
		// 			const obj = User.create({
		// 				username,
		// 				email,
		// 				password,
		// 				role,
		// 				businessId,
		// 			});

		// 			// Assert
		// 			expect(obj.email).toEqual(email);
		// 		} catch (err) {
		// 			throw new Error(err);
		// 		}
		// 	});

		// 	// Exception tests
		// 	it("should throw an error if not provided with any values.", () => {
		// 		// Arrange
		// 		const cb = () => User.create();

		// 		// Assert
		// 		expect(cb).toThrow();
		// 	});

		// 	it("should throw an error if 'username' is not a string", () => {
		// 		try {
		// 			// Arrange
		// 			const username = 123;
		// 			const email = "dualipa@gmail.com";
		// 			const password = "ILoveMusic123!";
		// 			const role = "admin";
		// 			const businessId = "6392dfeca277cb08131971f3";

		// 			// Act
		// 			const cb = () =>
		// 				User.create({ username, email, password, role, businessId });

		// 			// Assert
		// 			expect(cb).toThrow();
		// 		} catch (err) {
		// 			throw new Error(err);
		// 		}
		// 	});

		// 	it("should throw an error if 'email' is not a string", () => {
		// 		try {
		// 			// Arrange
		// 			const username = "dualipa";
		// 			const email = 123;
		// 			const password = "ILoveMusic123!";
		// 			const role = "admin";
		// 			const businessId = "6392dfeca277cb08131971f3";

		// 			// Act
		// 			const cb = () =>
		// 				User.create({ username, email, password, role, businessId });

		// 			// Assert
		// 			expect(cb).toThrow();
		// 		} catch (err) {
		// 			throw new Error(err);
		// 		}
		// 	});

		// 	it("should throw an error if 'email' is in an invalid format", () => {
		// 		try {
		// 			// Arrange
		// 			const username = "dualipa";
		// 			const email = "dualipa";
		// 			const password = "ILoveMusic123!";
		// 			const role = "admin";
		// 			const businessId = "6392dfeca277cb08131971f3";

		// 			// Act
		// 			const cb = () =>
		// 				User.create({ username, email, password, role, businessId });

		// 			// Assert
		// 			expect(cb).toThrow();
		// 		} catch (err) {
		// 			throw new Error(err);
		// 		}
		// 	});
	});
});
