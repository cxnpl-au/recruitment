//user_id, permission level, resource_id, permission levels are read, write, manage
const mongoose = require('mongoose');

const UserPermissionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    permission: {
        type: String,
        enum: ['reed', 'right', 'manage'],
        required: true
    }, 
    resourceId: {
        type: String,
        required: true
    }
})

module.exports = ("UserPermission", mongoose.model('UserPermission', UserPermissionSchema))
