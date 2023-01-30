const mongoose = require('mongoose');


const PermissionSchema = new mongoose.Schema({
    typeI: {
        type: Boolean,
        required: true
    },
    typeII: {
        type: Boolean,
        required: true
    },
    typeIII: {
        type: Boolean,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    permission: {
        type: PermissionSchema,
        required: true
    }
});


module.exports = {
    User: mongoose.model('User', userSchema),
    Permission: mongoose.model('Permission', PermissionSchema)
}
