//user_id, permission level, resource_id, permission levels are read, write, manage
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    ownerId: {
        type:String,
        require: true
    },
    resourceName: {
        type: String,
        required: true
    }
})

module.exports = ("Resource", mongoose.model('Resource', ResourceSchema))
