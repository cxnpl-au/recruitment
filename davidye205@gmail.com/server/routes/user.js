const router = require("express").Router();
const cors = require("cors");
const verify = require("./verifyToken");

const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { registerValidation, loginValidation } = require("../validation");

dotenv.config();

router.use(cors());

//Register new user
router.post("/register", async (req, res) => {
  //Validate register data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //Hash password
  const salt = await bcrypt.genSalt(10); //Generate salt, number in genSalt() function sets how complex(?) salt is
  const hashedPassword = await bcrypt.hash(req.body.password, salt); //Use salt to generate a hashed password

  //Creates a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.status(200).send({ user: savedUser._id });
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send(token);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Login
router.post("/login", async (req, res) => {
  //Validate register data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if user is already in the database
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email not found");
  } catch (err) {
    res.status(400).send(err.message);
  }

  //Check if passwords match
  try {
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid password");
  } catch (err) {
    res.status(400).send(err.message);
  }

  //Create and assign web token
  //JWT - JSON web tokens, make requests as a logged in user
  try {
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send({ token, userId: user._id });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Update user details
router.post("/", verify, async (req, res) => {
  try {
    const user = await User.findOne({
      userId: req.user._id,
    });
    console.log(user);

    user.name = req.body.name;
    console.log(user);
    const updatedUser = await user.save();
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Delete user
router.post("/", verify, async (req, res) => {
  try {
    const deletedUser = await User.deleteOne({
      userId: req.user._id,
    });
    res.status(200).send(deletedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
