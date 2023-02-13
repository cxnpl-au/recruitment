const express = require("express");
const User = require("../models/user");
const Organisation = require("../models/organisation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { response } = require("express");

exports.getOrgs = async (req, response) => {
  return "get orgs";
};

exports.createOrg = async (req, response) => {
  const org = new Organisation({
    name: req.body.name,
  });

  org
    .save()
    .then((res) => {
      response.status(201).send({
        message: "Organisation created successfully",
        id: org._id,
        name: org.name,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error creating organisation",
        error,
      });
    });
  return org;
};

exports.deleteOrg = async (req, response) => {
  const id = req.params.id;

  const user = User.findByIdAndDelete(id)
    .then((res) => {
      console.log(res);
      response.status(200).send("Org deleted");
    })
    .catch((error) => {
      response.status(404).send("Org could not be deleted", error);
    });
};

exports.updateOrg = async (req, response) => {
  const id = req.params.id;
};
