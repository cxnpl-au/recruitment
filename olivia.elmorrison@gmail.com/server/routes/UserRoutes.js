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

// Creating new user
router.post('/', async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            permissions: req.body.permissions
        });
        const newUser = await user.save();

        res.status(201).json({ newUser });
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

module.exports = router;