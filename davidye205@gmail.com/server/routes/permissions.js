const router = require("express").Router();
const verify = require("./verifyToken");
const {
  getAllPermissionsForUser,
  getPermissionForResource,
  upsertPermission,
  deletePermissionsForResource,
} = require("../controllers/permissions");

//Get user permissions (display all of them)
router.get("/", verify, async (req, res) => {
  try {
    const permissionsForUser = await getAllPermissionsForUser(req.user._id);
    res.status(200).send(permissionsForUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Get single user permission level for specified resource
router.get("/:resourceId", verify, async (req, res) => {
  try {
    const permissionForResource = await getPermissionForResource(
      req.user._id,
      req.params.resourceId,
      req.body.permission
    );
    res.status(200).send(permissionForResource);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Register permission for a user
router.post("/:resourceId", verify, async (req, res) => {
  try {
    const permission = await upsertPermission(
      req.user._id,
      req.body.userId,
      req.params.resourceId,
      req.body.permission
    );
    res.status(200).send(permission);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Delete all permissions linked to a resource
router.delete("/:resourceId", verify, async (req, res) => {
  try {
    const deletedPermissions = await deletePermissionsForResource(
      req.user._id,
      req.params.resourceId
    );
    res.status(200).send(deletedPermissions);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
