const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../auth");

const UserController = require("../controllers/userController");

app = express();

app.get("/users", auth, UserController.getUsers);

app.post("/users", UserController.createUser);

app.post(`/delete/:id`, auth, UserController.deleteUser);

// todo update user
app.post(`/update/:id`, auth, UserController.updateUser);

app.post(`/login`, UserController.login);

module.exports = app;
