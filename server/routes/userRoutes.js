// const router = require("express").Router();
const express = require("express");
const userModel = require("../models/user");

app = express();

// todo user auth??

// get users
app.get("/users", async (req, resp) => {
  const users = await userModel.find({});

  try {
    resp.send(users);
  } catch (err) {
    resp.status(500).send(err);
  }
});

// create users
app.post("/users", async (req, resp) => {
  const user = new userModel(req.body);

  try {
    await user.save();
    resp.status(200).send("User added");
  } catch (err) {
    resp.status(500).send(err);
  }
});

// delete users
app.post(`/delete/:id`, async (req, resp) => {
  const id = params.req.id;
  try {
    const deleted = userModel.findByIdAndDelete(id);
    if (!deleted) response.status(404).send("User not found");
    response.status(200).send("User deleted");
  } catch (error) {
    response.status(500).send(error);
  }
});

// update user
app.post(`/update/:id`, async (req, resp) => {
  const id = params.req.id;

  // check response for what field to update
  // get user from db
  // update role
});

module.exports = app;

// import express, { Request, Response } from "express";
// import { ObjectId } from "mongodb";
// import { collections } from "../services/database.service";
// import User from "../models/user";

// export const usersRouter = express.Router();

// usersRouter.use(express.json());

// // GET
// usersRouter.get("/", async (_req: Request, res: Response) => {
//   try {
//     const users = await collections.users?.find({}).toArray();

//     res.status(200).send(users);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// // GET BY ID
// usersRouter.get("/:id", async (req: Request, res: Response) => {
//   const id = req?.params?.id;

//   try {
//     const query = { _id: new ObjectId(id) };
//     const user = await collections.users?.findOne(query);

//     if (user) {
//       res.status(200).send(user);
//     }
//   } catch (error) {
//     res
//       .status(404)
//       .send(`Unable to find matching document with id: ${req.params.id}`);
//   }
// });

// // POST
// usersRouter.post("/", async (req: Request, res: Response) => {
//   try {
//     const newUser = req.body as User;
//     const result = await collections.users?.insertOne(newUser);

//     result
//       ? res
//           .status(201)
//           .send(`Successfully created a new user with id ${result.insertedId}`)
//       : res.status(500).send("Failed to create a new user.");
//   } catch (error) {
//     console.error(error);
//     res.status(400).send(error.message);
//   }
// });

// // PUT
// usersRouter.put("/:id", async (req: Request, res: Response) => {
//   const id = req?.params?.id;

//   try {
//     const updatedUser: User = req.body as User;
//     const query = { _id: new ObjectId(id) };

//     const result = await collections.users?.updateOne(query, {
//       $set: updatedUser,
//     });

//     result
//       ? res.status(200).send(`Successfully updated user with id ${id}`)
//       : res.status(304).send(`User with id: ${id} not updated`);
//   } catch (error) {
//     console.error(error.message);
//     res.status(400).send(error.message);
//   }
// });

// // DELETE
// usersRouter.delete("/:id", async (req: Request, res: Response) => {
//   const id = req?.params?.id;

//   try {
//     const query = { _id: new ObjectId(id) };
//     const result = await collections.users?.deleteOne(query);

//     if (result && result.deletedCount) {
//       res.status(202).send(`Successfully removed user with id ${id}`);
//     } else if (!result) {
//       res.status(400).send(`Failed to remove user with id ${id}`);
//     } else if (!result.deletedCount) {
//       res.status(404).send(`User with id ${id} does not exist`);
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(400).send(error.message);
//   }
// });
