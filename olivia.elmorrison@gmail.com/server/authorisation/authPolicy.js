module.exports = {
	updateUserPermissions: function (permissions) {
		return permissions === "ADMIN";
	},
    getTeam: function (permissions) {
		return permissions === "ADMIN";
	},
    createProject: function (permissions) {
		return permissions === "ADMIN";
	},
	updateProject: function (permissions) {
		return permissions === "ADMIN" || permissions === "APPROVER";
	},
	viewProject: function (permissions) {
		return permissions === "ADMIN" || permissions === "APPROVER";
	}
};