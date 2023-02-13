const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const AccountController = require("../controllers/accountController");
const UserController = require("../controllers/userController");
const OrganisationController = require("../controllers/organisationController");

app = express();

// todo protect route
app.get("/accounts", UserController.auth, AccountController.getAccounts);

app.post("/accounts", AccountController.createAccount);

app.post(
  `/accounts/delete/:id`,
  UserController.auth,
  AccountController.deleteAccount
);

// app.post(
//   `/accounts/update/:id`,
//   UserController.auth,
//   AccountController.updateAccount
// );

module.exports = app;
