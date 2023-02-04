const router = require("express").Router();
const verify = require("./verifyToken");
const Resource = require("../model/resource");

//Create new resource
router.post("/registerResource", verify, async (req, res) => {
  //User should only be able to register permissions for resources they own

  //Check if resource with same name already exists
  const resourceNameExists = await Resource.findOne({
    resourceName: req.body.resourceName,
  });
  if (resourceNameExists)
    return res.status(400).send("Resource name already exists");

  const resource = new Resource({
    ownerId: req.user._id,
    resourceName: req.body.resourceName,
  });

  try {
    const savedResource = await resource.save();
    res.status(200).send(savedResource);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Get all resources
router.get("/", verify, async (req, res) => {
  try {
    const resources = await Resource.find({ ownerId: req.user._id });
    res.status(200).send(resources);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
