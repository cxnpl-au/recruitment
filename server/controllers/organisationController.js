const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { response } = require("express");

exports.createOrg = async (req, response) => {
  const org = new Organisation({
    name: req.body.name,
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