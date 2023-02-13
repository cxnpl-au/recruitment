const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Organisation = require("../models/organisation");

const getCurrentUser = async (userId) => {
  return await User.findById(mongoose.Types.ObjectId(userId));
};

const getUserOrg = async (userId) => {
  const user = await getCurrentUser(userId);
  return user.organisation?.toString();
};

const getOrgName = async (orgId) => {
  return await Organisation.findById(mongoose.Types.ObjectId(orgId));
};

exports.getUsers = async (req, response) => {
  const org = await getUserOrg(req.user.userId);
  if (org != null) {
    const result = await User.find({ organisation: org })
      .then((users) => {
        console.log("Getting users in org");
        response.status(200).send(users);
      })
      .catch((error) => {
        console.log(error);
        response.status(500).send(error);
      });
  } else {
    response.status(404).send("User not in organisation");
  }
};

exports.getUserById = async (req, response) => {
  const result = await getCurrentUser(req.params.id);
  const org = await getOrgName(result.organisation);

  console.log("org", org);
  if (result) {
    response.status(200).send({
      email: result.email,
      name: result.name,
      organisation: org.name,
      role: result.role,
    });
  } else {
    response.status(500).send("User not found");
  }
};

exports.createUser = async (req, response) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        role: req.body.role,
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
      });

      user
        .save()
        .then((res) => {
          const payload = {
            userId: user._id,
            userEmail: user.email,
          };
          const token = jwt.sign(payload, "TOKEN", { expiresIn: "1h" });
          response.status(201).send({
            message: "User created successfully",
            id: user._id,
            email: user.email,
            token: token,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    .catch((error) => {
      response.status(500).send(error);
    });
};

exports.deleteUser = async (req, response) => {
  const id = req.params.id;

  const user = User.findByIdAndDelete(id)
    .then((res) => {
      console.log(res);
      response.status(200).send("User deleted");
    })
    .catch((error) => {
      response.status(404).send("User could not be deleted", error);
    });
};

exports.updateUser = async (req, response) => {
  const userId = mongoose.Types.ObjectId(req.params?.id);
  if (userId) {
    const user = await User.findByIdAndUpdate(userId, {
      name: req.body.name,
      role: req.body.role,
      organisation: req.body.organisation,
      email: req.body.email,
    })
      .then((res) => {
        response.status(200).send("User updated");
      })
      .catch((error) => {
        response
          .status(500)
          .send({ message: "User could not be updated", error });
      });
  } else {
    response.status(500).send({ message: "Please specify a user", error });
  }
};

exports.login = async (req, response) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(`attempt login ${email}`);

  const resp = User.findOne({ email: email })
    .then((user) => {
      console.log(user);
      bcrypt
        .compare(password, user.password)
        .then((res) => {
          const payload = {
            userId: user._id,
            userEmail: user.email,
          };
          console.log("Comparing password", res);
          if (!res) {
            return response.status(401).send({
              message: "Invalid password",
              error: error,
            });
          }
          const token = jwt.sign(payload, "TOKEN", { expiresIn: "1h" });
          console.log(token);
          response.status(200).send({
            message: "Login successful",
            id: user._id,
            email: user.email,
            token: token,
          });
        })
        .catch((error) => {
          response
            .status(401)
            .send({ message: "Invalid password", error: error });
        });
    })
    .catch((error) => {
      response.status(401).send({ message: "Invalid email", error: error });
    });

  return resp;
};

exports.auth = async (req, response, next) => {
  try {
    const token = await req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "TOKEN");
    const user = decodedToken;
    req.user = user;
    next();
  } catch (error) {
    response.status(401).json({
      message: "Request not authorised",
      error: error,
    });
  }
};
