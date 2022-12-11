const Business = require("../models/Business");
const User = require("../models/User");

describe("Business", () => {
	describe("Initialisation", () => {
		// Positive tests
		it("should create a new object with a 'name' property set to the 'name' argument provided when called with the 'new' keyword.", () => {
			try {
				// Arrange
				const name = "myBusiness";

				// Act
				const obj = new Business({
					name,
				});

				// Assert
				expect(obj.name).toEqual(name);
			} catch (err) {}
		});

		// Exception tests
		it("should throw an error if not provided with any values.", async () => {
			try {
				// Arrange
				const business = await Business.create();

				// Assert
				expect(business).toThrow();
			} catch (err) {}
		});

		describe("totalBalance", () => {
			it("should return the total amount of all accounts under the business.", () => {
				try {
					// Arrange
					const name = "myBusiness";
					const accounts = [
						{
							name: "sales",
							balance: 10000,
						},
						{
							name: "product",
							balance: 10000,
						},
						{
							name: "marketing",
							balance: 10000,
						},
					];
					const team = [
						"6394537776cbaa31cd42f819",
						"6394539576cbaa31cd42f835",
						"63944c436f5e0c90de6a113e",
					];

					// Act
					const result = new Business(name, accounts, team).totalBalance();

					// Assert
					expect(result).toEqual(30000);
				} catch (err) {}
			});
		});
	});
});
