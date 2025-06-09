const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    senderId: {
        type: String, required: true
    },
    roomId: {
        type: String
    },
    timestamps:{
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });

MessageSchema.index({ roomId: 1, timestamps: -1 });

module.exports= mongoose.model('Message', MessageSchema);