const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserController = require("../controllers/userController");

app = express();

app.get("/users", UserController.auth, UserController.getUsers);

app.post("/users", UserController.createUser);

app.post(`/users/delete/:id`, UserController.auth, UserController.deleteUser);

// todo update user
app.post(`/users/update/:id`, UserController.auth, UserController.updateUser);

app.post(`/login`, UserController.login);

app.post("/auth", UserController.auth);

module.exports = app;
