const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserController = require("../controllers/userController");
const OrganisationController = require("../controllers/organisationController");

app = express();

// todo protect route
app.get("/orgs", UserController.auth, OrganisationController.getOrgs);

app.post("/orgs", OrganisationController.createOrg);

app.post(`/delete/:id`, UserController.auth, OrganisationController.deleteOrg);

// todo update user
app.post(`/update/:id`, UserController.auth, OrganisationController.updateOrg);

module.exports = app;
