const { Permissions } = require("../enums/permissions");
const UserPermission = require("../model/userPermission");

//Get all permissions for a user
const getAllPermissionsForUser = async (userId) => {
  try {
    const permissionsForUser = await UserPermission.find({
      userId: userId,
    });
    if (!permissionsForUser) {
      throw new Error("no permissions available for user");
    }

    return permissionsForUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

//Gets boolean for whether user has specified permission for resource
const getPermissionForResource = async (userId, resourceId, permission) => {
  try {
    const userPermission = await UserPermission.findOne({
      resourceId,
      userId,
    });
    if (!userPermission) {
      return false;
    }
    console.log(userPermission.permission == permission);
    return userPermission.permission == permission;
  } catch (err) {
    throw new Error(err.message);
  }
};

//Split into post and update permissions
const upsertPermission = async (
  viewerUserId,
  targetUserId,
  resourceId,
  permission
) => {
  //User should only be able to register permissions for resources they own
  //Check if any user has permissions for this resource - if no, then user is creating the resource, and should be assigned to manage the resource
  const resourcePermissions = await UserPermission.findOne({
    resourceId,
  });

  if (!resourcePermissions) {
    const userPermission = new UserPermission({
      userId: viewerUserId,
      resourceId,
      permission,
    });

    try {
      const savedUserPermission = await userPermission.save();
      return savedUserPermission;
    } catch (err) {
      throw new Error(err);
    }
  }

  const viewerUserPermission = await UserPermission.findOne({
    userId: viewerUserId,
    resourceId,
  });
  //If user does not own resource, return status 400 with message ("cannot register permission, user does not own resource")
  if (viewerUserPermission.permission != Permissions.MANAGE) {
    throw new Error("Cannot register permission, user does not own resource");
  }

  //validate userId and resourceId are available
  try {
    const savedUserPermission = await UserPermission.findOneAndUpdate(
      {
        userId: targetUserId,
        resourceId: resourceId,
      },
      {
        userId: targetUserId,
        permission: permission,
        resourceId: resourceId,
      },
      {
        upsert: true,
        new: true,
      }
    );

    return savedUserPermission;
  } catch (err) {
    throw new Error(err);
  }
};

//Deletes all permissions by resourceId
const deletePermissionsForResource = async (userId, resourceId) => {
  const permission = await UserPermission.findOne({
    userId,
    resourceId,
  });

  if (!permission) {
    throw new Error("Permission not found");
  }

  if (permission.permission != Permissions.MANAGE) {
    throw new Error("user does not have permission to delete this resource");
  }

  try {
    const deletedPermissions = await UserPermission.deleteMany({
      resourceId,
    });
    return deletedPermissions;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  getAllPermissionsForUser,
  getPermissionForResource,
  upsertPermission,
  deletePermissionsForResource,
};
