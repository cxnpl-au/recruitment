const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app = express();

// todo user auth??

// get users
app.get("/users", async (req, response) => {
  const resp = await User.find({})
    .then((users) => {
      console.log("getting users");
    //   console.log(users);
      response.status(200).send(users);
    })
    .catch((error) => {
      console.log(error);
      response.status(500).send(error);
    });
});

// create users
app.post("/users", async (req, response) => {
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
          // todo check for duplicate emails and return error
          response.status(201).send({
            message: "User created successfully",
            res,
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
});

// delete users
app.post(`/delete/:id`, async (req, response) => {
  const id = req.params.id;

  const user = User.findByIdAndDelete(id)
    .then((res) => {
      console.log(res);
      response.status(200).send("User deleted");
    })
    .catch((error) => {
      response.status(404).send("User could not be deleted", error);
    });
});

// todo update user
app.post(`/update/:id`, async (req, response) => {
  const id = req.params.id;

  // check response for what field to update
  // get user from db
  // update role
});

app.post(`/login`, (req, response) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(`attempt login ${email}`);

  const user = User.findOne({ email: email })
    .then((user) => {
      console.log(user);
      bcrypt
        .compare(user.password, password)
        .then((res) => {
          console.log(res);
          if (!res) {
            return response.status(401).send({
              message: "Invalid password",
              error: error,
            });
          }
          //   const token = jwt.sign(
          //     {
          //       userId: user._id,
          //       userEmail: user.email,
          //     },
          //     "TOKEN",
          //     { expiresIn: "8h" }
          //   );
          //   console.log(token);
          response.status(200).send({
            message: "Login successful",
            email: user.email,
            token,
          });
        })
        .catch((error) => {
          response
            .status(401)
            .send({ message: "Invalid password2", error: error });
        });
    })
    .catch((error) => {
      response.status(401).send({ message: "Invalid email", error: error });
    });

  return user;
});

module.exports = app;
