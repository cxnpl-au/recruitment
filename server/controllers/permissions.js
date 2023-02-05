const { Permissions } = require("../enums/permissions");
const UserPermission = require("../model/userPermission");

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

const getPermissionForResource = async (userId, resourceId) => {
  try {
    const userPermission = await UserPermission.findOne({
      resourceId,
      userId,
    });
    if (!userPermission) {
      throw new Error("resource is not available for user");
    }
    const { permission } = userPermission;
    return { userId, permission, resourceId };
  } catch (err) {
    throw new Error(err.message);
  }
};

const upsertPermission = async (
  viewerUserId,
  targetUserId,
  resourceId,
  permission
) => {
  //User should only be able to register permissions for resources they own
  //Check if user owns resource
  const viewerUserPermission = await UserPermission.findOne({
    userId: viewerUserId,
    resourceId,
  });

  console.log(viewerUserPermission);

  //If user does not own resource, return status 400 with message ("cannot register permission, user does not own resource")
  if (
    !viewerUserPermission ||
    viewerUserPermission.permission != Permissions.MANAGE
  ) {
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

module.exports = {
  getAllPermissionsForUser,
  getPermissionForResource,
  upsertPermission,
};
