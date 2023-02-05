//user_id, permission level, resource_id, permission levels are read, write, manage
const mongoose = require("mongoose");
const { Permissions } = require("../enums/permissions");

const UserPermissionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  permission: {
    type: String,
    enum: [Permissions.READ, Permissions.WRITE, Permissions.MANAGE],
    required: true,
  },
  resourceId: {
    type: String,
    required: true,
  },
});

module.exports =
  ("UserPermission", mongoose.model("UserPermission", UserPermissionSchema));
