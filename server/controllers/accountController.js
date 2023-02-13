const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const Organisation = require("../models/organisation");
const Account = require("../models/account");
const jwt = require("jsonwebtoken");

const UserController = require("../controllers/userController");

exports.getAccounts = async (req, response) => {
  // get accounts in user org
  // get user object
  const user = await User.findById(mongoose.Types.ObjectId(req.user.userId));
  // get user org id
  const org = user.organisation.toString();
  if (org != null) {
    const result = await Account.find({ organisation: org })
      .then((res) => {
        console.log(res);
        response.status(200).send(res);
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  } else {
    response.status(404).send("No accounts in organisation");
  }
};

exports.createAccount = async (req, response) => {
  const acc = new Account({
    name: req.body.name,
    organisation: req.body.organisation,
  });

  acc
    .save()
    .then((res) => {
      response.status(201).send({
        message: "Account created successfully",
        id: acc._id,
        name: acc.name,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error creating account",
        error,
      });
    });
};

exports.deleteAccount = async (req, response) => {
  const id = req.params.id;

  const acc = Account.findByIdAndDelete(id)
    .then((res) => {
      console.log(res);
      response.status(200).send("Account deleted");
    })
    .catch((error) => {
      response.status(404).send("Account could not be deleted", error);
    });
};

// exports.updateAccount = async (req, response) => {
//   const id = req.params.id;
// };
