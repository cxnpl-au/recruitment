const router = require('express').Router();
const Business = require('../models/Business');

// Get one business
router.get('/:id', async (req, res) => {
    try {
        const business = await Business.findById(req.params.id)
        res.json(business);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Create one business
router.post('/create', async (req, res) => {
    try {
        const project = new Business({
            name: req.body.name,
            team: [],
            projects: []
        });
        const newProject = await project.save();
        
        res.status(201).json({ newProject });
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Get all users in this business business
router.get('/team/:id', async (req, res) => {
    try {
        const business = await Business.findOne({
            _id: req.params.id,
        }).populate({
            path: "team",
        });

        if (!business.team) {
            throw new error({message: `Error fetching team`})
        }

        res.status(200).json(business.team);
    } catch (err) {
        res.status(500).json({ message: error.message})
    }
});

//TODO: remove - only for testing purposes
// Get all business
router.get('/', async (req, res) => {
    try {
        const business = await Business.find();
        res.json(business);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

module.exports = router;