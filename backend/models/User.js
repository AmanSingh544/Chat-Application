const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    avatar:{
        type: String
    },
    color: {
        type: String
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'away'],
        default: 'online'
    },
    password: {
        type: String,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);