const router = require("express").Router();
const verify = require("./verifyToken");
const Resource = require("../model/resource");
const UserPermission = require("../model/userPermission");
const { Permissions } = require("../enums/permissions");
const {
  getAllPermissionsForUser,
  getPermissionForResource,
  upsertPermission,
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
    const { resourceId } = req.params;
    const userId = req.user._id;
    console.log(req.user);
    console.log(req.params);
    const userPermission = await UserPermission.findOne({
      resourceId,
      userId,
    });
    if (!userPermission) {
      return res.status(400).send("resource is not available for user");
    }

    const { permission } = userPermission;
    res.status(200).send({ userId, permission, resourceId });
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

//Register permission for a user
// router.post("/:resourceId", verify, async (req, res) => {
//   //User should only be able to register permissions for resources they own
//   //Check if user owns resource
//   const viewerUserPermission = await UserPermission.findOne({
//     userId: req.user._id,
//     resourceId: req.params.resourceId,
//   });

//   //If user does not own resource, return status 400 with message ("cannot register permission, user does not own resource")
//   if (
//     !viewerUserPermission ||
//     viewerUserPermission.permission != Permissions.MANAGE
//   ) {
//     return res
//       .status(400)
//       .send("Cannot register permission, user does not own resource");
//   }

//   //validate userId and resourceId are available

//   try {
//     const savedUserPermission = await UserPermission.findOneAndUpdate(
//       {
//         userId: req.body.userId,
//         resourceId: req.params.resourceId,
//       },
//       {
//         userId: req.body.userId,
//         permission: req.body.permission,
//         resourceId: req.params.resourceId,
//       },
//       {
//         upsert: true,
//         new: true,
//       }
//     );
//     console.log(savedUserPermission);
//     res.status(200).send(savedUserPermission);
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

//Request permission? request read/write permission for a resource, owner gets some notification and have to accept/decline

//Revoke Permission/Delete permission

module.exports = router;
