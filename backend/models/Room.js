const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name:{
        type:String,
        required:false,
        unique:true,
    },
    purpose:{
        type:String,
        required:true,
    },
    isPrivate:{ type: Boolean,default: false },
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    admin: {type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

RoomSchema.index({ name: 1, purpose: 1 }, { unique: true });
module.exports = mongoose.model('Room', RoomSchema);