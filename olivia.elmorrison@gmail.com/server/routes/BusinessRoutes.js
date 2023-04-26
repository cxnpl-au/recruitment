const router = require('express').Router();
const Business = require('../models/Business');
const Project = require('../models/Project');

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

// Get all users in this business
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

// Get all projects in this business
router.get('/projects/:id', async (req, res) => {
    try {
        const business = await Business.findOne({
            _id: req.params.id,
        })

        if (!business || !business.projects) {
            throw new error({message: `Error fetching team`})
        }

        res.status(200).json(business.projects);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Create one project
router.post('/projects/create/:id', async (req, res) => {
    try {
        const project = {
            name: req.body.name,
            estimate: 0,
            expense: 0
        }
        const business = await Business.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { projects:  project} },
            { new: true }
        );

        if (!business) {
            return res.status(400).json({ message: " error " });
        }

        res.status(200).json(business);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

// Updating one user
router.patch('/update/:businessId/projects/:projectId', async (req, res) => {
    try {
        console.log("HEREEE");
        // console.log(req);
        const business = await Business.findOne({
            _id: req.params.businessId,
        })
        console.log(req.params);
        const project = business.projects.id(req.params.projectId);
        console.log(project);

        // Rewrite account data with changes applied
        const updatedProject = { ...project.toJSON(), ...req.body };

        // Save updated account data to business
        business = await Business.findOneAndUpdate(
            { _id: req.params.businessId, "projects._id": req.params.projectId },
            { $set: { "projects.$": updatedProject } },
            { runValidators: true, new: true }
        );

        if (!business) {
            throw new error({ message: "Error updating project" });
        }

        res.status(200).json(business);
    } catch (error) {
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

//TODO: Remove this, purely for testing purposes
//Delete all users
router.delete('/all', async (req, res) => {
    const user = await Business.deleteMany();

    if (!user) {
        return res.status(400).json({ message: "Unable to delete user." });
    }

    res.status(200).json({ message: "User deleted." });
});

module.exports = router;