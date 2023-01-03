// If role matches the specified permissions, return true

module.exports = {
	canGetTeam: function (role) {
		return role === "admin";
	},
	canCreateAccount: function (role) {
		return role === "admin";
	},
	canUpdateAccount: function (role) {
		return role === "admin" || role === "editor";
	},
	canDeleteAccount: function (role) {
		return role === "admin";
	},
	canCreateUser: function (role) {
		return role === "admin";
	},
	canUpdateUser: function (role) {
		return role === "admin";
	},
	canDeleteUser: function (role) {
		return role === "admin";
	},
	canDeleteBusiness: function (role) {
		return role === "admin";
	},
};
