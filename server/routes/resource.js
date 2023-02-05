const router = require("express").Router();
const verify = require("./verifyToken");
const Resource = require("../model/resource");
const UserPermission = require("../model/userPermission");
const resource = require("../model/resource");
const { Permissions } = require("../enums/permissions");
const {
  upsertPermission: registerPermission,
  getAllPermissionsForUser,
} = require("../controllers/permissions");

//Create new resource
router.post("/", verify, async (req, res) => {
  //User should only be able to register permissions for resources they own

  const resource = new Resource({
    ownerId: req.user._id,
    resourceName: req.body.resourceName,
  });

  console.log(resource);

  const permission = new UserPermission({
    userId: req.user._id,
    permission: Permissions.MANAGE,
    resourceId: resource._id,
  });

  try {
    const savedResource = await resource.save();
    const savedPermission = await permission.save();
    res.status(200).send({
      _id: savedResource._id,
      ownerId: savedResource.ownerId,
      resourceName: savedResource.resourceName,
      permission: Permissions.MANAGE,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Get all resources (anything you have access to)
router.get("/", verify, async (req, res) => {
  // [{resourceId: 1, userId: 1, type: read}, {resourceId: 2, userId: 1, type: write}, ]
  const permissions = await getAllPermissionsForUser(req.user._id);
  // [1, 2]
  const resourceIds = permissions.map((permission) => permission.resourceId);

  /**
   * {
   *    1: "read",
   *    2: "write"
   * }
   */
  const resourceIdsToPermission = permissions.reduce((map, permission) => {
    map[permission.resourceId] = permission.permission;
    return map;
  }, {});

  console.log("resource ids to permission");
  console.log(resourceIdsToPermission);

  try {
    // [{ resourceId: 1, name: one, type: read}, { resourceId: 2, name: two}]
    const resources = await Resource.find().where("_id").in(resourceIds).exec();

    const resourcesWithType = resources.map((resource) => {
      return {
        _id: resource._id,
        ownerId: resource.ownerId,
        resourceName: resource.resourceName,
        permission: resourceIdsToPermission[resource._id],
      };
    });
    //convert storage resource to client facing resource to contain permission type
    res.status(200).send(resourcesWithType);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/:resourceId", verify, async (req, res) => {
  const resource = await Resource.findOne({
    _id: req.params.resourceId,
  });

  const permission = await UserPermission.findOne({
    userId: req.user._id,
    resourceId: req.params.resourceId,
  });
  console.log(permission);

  if (permission.permission === Permissions.READ) {
    return res
      .status(400)
      .send("user does not have permission to edit this resource");
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

  const permission = await UserPermission.findOne({
    userId: req.user._id,
    resourceId: req.params.resourceId,
  });

  if (!permission) {
    return res.status(404).send("Permission not found");
  }

  if (permission.permission !== Permissions.MANAGE) {
    return res
      .status(400)
      .send("user does not have permission to delete this resource");
  }

  try {
    const deletedResource = await resource.remove();
    const deletedPermissions = await UserPermission.deleteMany({
      resourceId: req.params.resourceId,
    });
    res.status(200).send({
      message: "Resource and all its permissions successfully deleted",
      resource: deletedResource,
      permissions: deletedPermissions,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/:resourceId/permissions", verify, async (req, res) => {
  try {
    const permission = await registerPermission(
      req.user._id,
      req.params.resourceId,
      req.body.permission
    );
    res.status(200).send(permission);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
