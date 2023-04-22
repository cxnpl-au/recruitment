const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Get one user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Sign up
router.post('/signup', async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            permissions: "SUBSCRIBER"
        });
        const newUser = await user.save();
        
        res.status(201).json({ newUser });
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new error("Email not found");

        if (user.password != req.body.password) throw new error("Incorrect password");

        // const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        // res.header("auth-token", token).send({ token, userId: user._id });
        res.status(200).json({userId: user.id})
        
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Updating one user
router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
			{ $set: req.body }
        );

        if (!user) {
            return res.status(400).json({ message: "Unable to update user." });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Deleting one user
router.delete('/', async (req, res) => {
    const user = await User.findOneAndDelete({
        _id: params.userId,
    });

    if (!user) {
        return res.status(400).json({ message: "Unable to delete user." });
    }

    res.status(200).json({ message: "User deleted." });
});


//TODO: Remove this, purely for testing purposes
//Delete all users
router.delete('/all', async (req, res) => {
    const user = await User.deleteMany();

    if (!user) {
        return res.status(400).json({ message: "Unable to delete user." });
    }

    res.status(200).json({ message: "User deleted." });
});

module.exports = router;