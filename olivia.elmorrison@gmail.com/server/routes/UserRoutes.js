const router = require('express').Router();
const User = require('../models/User');
const Business = require('../models/Business');
const { signToken, authUser, authUpdateUserPermissions } = require('../authorisation/auth');

// Create business with user as admin
router.post('/create/business', async (req, res) => {
    try {
        const business = new Business({
            name: req.body.businessName,
            team: [],
            projects: []
        });
        
        let newBusiness = await business.save();
        
        if (!newBusiness) {
            throw new Error({ message: "Error creating new business" })
        }

        //Creater gets admin permissions
        const user = new User({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            permissions: "ADMIN",
            businessId: newBusiness._id
        });
        const newUser = await user.save();

        if (!newUser) {
            return res.status(500).json({message: 'Error creating user'});
        }

        //Add admin to the team
        newBusiness = await Business.findOneAndUpdate(
            { _id: user.businessId },
            { $addToSet: { team: user._id } },
            { new: true }
        );

        const token = signToken(user);
        res.status(201).json({token, newUser});
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Sign up
router.post('/signup', async (req, res) => {
    try {
        //Default no authorisation
        const user = new User({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            permissions: "NONE",
            businessId: req.body.businessId
        });
        const newUser = await user.save();

        const business = await Business.findOneAndUpdate(
            { _id: user.businessId },
            { $addToSet: { team: user._id } },
            { new: true }
        );

        if (!business) {
            return res.status(404).json({message: 'Error adding user to business'});
        }

        const token = signToken(user);
        res.status(201).json({token, newUser});
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({message: 'Email not found'});

        if (user.password != req.body.password) return res.status(404).json({message: 'Error fetching project'});


		const token = signToken(user);
        
        res.status(200).json({token, user})
        
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Updating user permissions
router.patch('/update/permissions/:id', async (req, res) => {
    try {
        // Authenticate
        authUser(req, res);
        authUpdateUserPermissions(req, res);

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

//TODO: Remove this, purely for testing purposes
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