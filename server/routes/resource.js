const router = require("express").Router();
const verify = require("./verifyToken");
const Resource = require("../model/resource");
const { Permissions } = require("../enums/permissions");
const {
  upsertPermission,
  getPermissionForResource,
  getAllPermissionsForUser,
  deletePermissionsForResource,
} = require("../controllers/permissions");

//Create new resource
router.post("/", verify, async (req, res) => {
  const resource = new Resource({
    ownerId: req.user._id,
    resourceName: req.body.resourceName,
  });

  try {
    const savedResource = await resource.save();
    //Upsert permission checks if resource does not have an owner or if user owns resource, then upserts a MANAGE permission for the user creating the resource
    const savedPermission = await upsertPermission(
      req.user._id,
      req.user._id,
      resource._id,
      Permissions.MANAGE
    );
    res.status(200).send({
      _id: savedResource._id,
      ownerId: savedResource.ownerId,
      resourceName: savedResource.resourceName,
      permission: savedPermission.permission,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Get all resources for a user (As long as user has access - read, write, manage)
router.get("/", verify, async (req, res) => {
  // [{resourceId: 1, userId: 1, type: read}, {resourceId: 2, userId: 1, type: write}, ]
  //Fetch all permissions relevant to logged in user
  const permissions = await getAllPermissionsForUser(req.user._id);
  // [1, 2]
  //Get all resourceIds for all resources user has permissions for
  const resourceIds = permissions.map((permission) => permission.resourceId);

  /**
   * {
   *    1: "read",
   *    2: "write"
   * }
   */

  //Added permissions and resourceIds to a key value pair, resourceId: permission
  const resourceIdsToPermission = permissions.reduce((map, permission) => {
    map[permission.resourceId] = permission.permission;
    return map;
  }, {});
  try {
    const resources = await Resource.find().where("_id").in(resourceIds).exec();
    //convert storage resource to client facing resource to contain permission type
    const resourcesWithType = resources.map((resource) => {
      return {
        _id: resource._id,
        ownerId: resource.ownerId,
        resourceName: resource.resourceName,
        permission: resourceIdsToPermission[resource._id],
      };
    });
    res.status(200).send(resourcesWithType);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//update/edit resource
router.post("/:resourceId", verify, async (req, res) => {
  const resource = await Resource.findOne({
    _id: req.params.resourceId,
  });

  //Check if user has write permission, getPermissionForResource(userId, resourceId, READ) is false
  const readOnlyPermission = await getPermissionForResource(
    req.user._id,
    req.params.resourceId,
    Permissions.READ
  );
  if (readOnlyPermission) {
    return res
      .status(400)
      .send("User does not have permission to edit this resource");
  }

  resource.resourceName = req.body.resourceName;

  try {
    const savedResource = await resource.save();
    res.status(200).send(savedResource);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Delete a resource and all its associated permissions
router.delete("/:resourceId", verify, async (req, res) => {
  const resource = await Resource.findOne({
    _id: req.params.resourceId,
  });

  if (!resource) {
    return res.status(404).send("Resource not found");
  }

  try {
    const deletedResource = await resource.remove();
    const deletedPermissions = await deletePermissionsForResource(
      req.user._id,
      req.params.resourceId
    );
    res.status(200).send({
      message: "Resource and all its permissions successfully deleted",
      resource: deletedResource,
      permissions: deletedPermissions,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Post new permission for owned resource
router.post("/:resourceId/permissions", verify, async (req, res) => {
  try {
    const permission = await upsertPermission(
      req.user._id,
      req.body.userId,
      req.params.resourceId,
      req.body.permission
    );
    res.status(200).send(permission);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
