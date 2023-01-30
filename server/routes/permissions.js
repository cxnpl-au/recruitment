const router = require('express').Router();
const verify = require('./verifyToken');
const { User } = require('../model/user');


router.get('/permissions', verify, async (req, res) => {

    try {
        const userData = await User.findOne({_id: req.user._id});
        res.send(userData.permission);
    } catch (err) {
        res.status(400).send(err.message);
    }
 
});


module.exports = router;