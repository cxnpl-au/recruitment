const router = require("express").Router();
const verify = require("./verifyToken");
const Resource = require("../model/resource");
const UserPermission = require("../model/userPermission");

//Get user permissions (display all of them)
router.get("/", verify, async (req, res) => {
  try {
    const userPermission = await UserPermission.find({
      userId: req.user._id,
    });
    if (!userPermission) {
      return res.status(400).send("no resources available for user");
    }
    res.status(200).send(userPermission);
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

//TODO, create front end for this, dropdown menu to select which level of permission
//switched to upsert, update permission for certain resource IF it exists, insert it if it does not.
router.post("/upsertPermission", verify, async (req, res) => {
  //User should only be able to register permissions for resources they own
  //Check if user owns resource - this doesnt work
  const resource = await Resource.findOne({
    resourceId: req.body.resourceId,
    ownerId: req.user._id,
  });

  //If user does not own resource, return status 400 with message ("cannot register permission, user does not own resource")
  if (!resource) {
    return res
      .status(400)
      .send("Cannot register permission, user does not own resource");
  }

  const userPermission = await UserPermission.findOne({
    userId: req.user._id,
    resourceId: req.body.resourceId,
  });

  // Update the existing user permission
  if (userPermission) {
    userPermission.permission = req.body.permission;
    try {
      const savedUserPermission = await userPermission.save();
      res.status(200).send(userPermission);
    } catch (err) {
      res.status(400).send(err.message);
    }
  } else {
    // Create a new user permission
    const newUserPermission = new UserPermission({
      userId: req.user._id,
      permission: req.body.permission,
      resourceId: req.body.resourceId,
    });
    try {
      const savedUserPermission = await newUserPermission.save();
      res.status(200).send(newUserPermission);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
});

//Request permission? request read/write permission for a resource, owner gets some notification and have to accept/decline

//Revoke Permission/Delete permission

module.exports = router;
