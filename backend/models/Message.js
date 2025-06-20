const mongoose = require('mongoose');
const User = require('./User');
const Room = require('./Room');

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    senderId: {
        type: mongoose.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    senderName: {
        type: String,
    },
    status: {
        type: String,
        enum: ['sending', 'sent', 'delivered', 'read'],
        default: 'sending'
    },
    isOwn: {
        type: Boolean
    },
    roomId: {
        type: mongoose.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    timestamp:{
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });

MessageSchema.index({ roomId: 1, timestamps: -1 });

module.exports= mongoose.model('Message', MessageSchema);