const router = require('express').Router();
const { authUser, authGetTeam, authUpdateProject, authCreateProject } = require('../authorisation/auth');
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

// Get all users in this business
router.get('/team/:id', async (req, res) => {
    try {
        //Authenticate
        authUser(req, res);
        authGetTeam(req, res);

        const business = await Business.findOne({
            _id: req.params.id,
        }).populate({
            path: "team",
        });

        if (!business.team) {
            return res.status(404).json({message: 'Error fetching team'});
        }

        res.status(200).json(business.team);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Get all projects in this business
router.get('/projects/:id', async (req, res) => {
    try {
        // Authenticate
        authUser(req, res);

        const business = await Business.findOne({
            _id: req.params.id,
        })

        if (!business || !business.projects) {
            return res.status(404).json({message: 'Error fetching project'});
        }

        res.status(200).json(business.projects);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Create one project
router.post('/projects/create/:id', async (req, res) => {
    try {
        // Authenticate
        authUser(req, res);
        authCreateProject(req, res);

        const project = {
            name: req.body.name,
            estimate: req.body.estimate,
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
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Updating one project
router.patch('/update/:businessId/projects/:projectId', async (req, res) => {
    try {
        // Authenticate
        authUser(req, res);
        authUpdateProject(req, res);

        const business = await Business.findOne({
            _id: req.params.businessId,
        })
        
        const project = business.projects.id(req.params.projectId);
        const updatedProject = { ...project.toJSON(), ...req.body };

        business = await Business.findOneAndUpdate(
            { _id: req.params.businessId, "projects._id": req.params.projectId },
            { $set: { "projects.$": updatedProject } },
            { runValidators: true, new: true }
        );

        if (!business) {
            return res.status(404).json({message: 'Error updating project'});
        }

        res.status(200).json(business);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

// Get all business names and ids
router.get('/', async (req, res) => {
    try {
        const business = await Business.find();
        const result = business.map((x) => {
            return {
                _id: x._id,
                name: x.name
            }
        })
        res.json(result);
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