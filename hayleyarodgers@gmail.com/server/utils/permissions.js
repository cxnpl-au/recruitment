// If role matches the specified permissions, return true

module.exports = {
	canGetUsers: function (role) {
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
};
