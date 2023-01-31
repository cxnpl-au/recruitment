const router = require('express').Router();
const verify = require('./verifyToken');
const UserPermission = require('../model/userPermission');


router.get('/permissions', async (req, res) => {
    try {
        const userPermission = await UserPermission.findOne({userId: req.body.userId});
        if (!userPermission) {
            return res.status(400).send('no resources available for user');
        }

    } catch (err) {
        res.status(400).send(err.message);
    }
 
});

router.post('/registerPermission', async (req, res) => {
    const userPermission = new UserPermission({
        userId: req.body.userId,
        permission: req.body.permission,
        resourceId: req.body.resourceId
    });

    try {
        const savedUserPermission = await userPermission.save();
        res.status(200).send(userPermission);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;