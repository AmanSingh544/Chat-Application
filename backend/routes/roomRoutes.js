const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

router.post('/create', async (req, res) => {
    const {name, purpose, isPrivate} = req.body;
    if (!name || !purpose) {
        return res.status(400).json({ message: 'Room name and purpose are mandatory' });
    }
    try {
        const existingRoom = await Room.findOne({ name });
        if(existingRoom){
            return res.status(400).json({message: 'Room name already exists'});
        }

        const room = new Room({
            name,
            purpose,
            isPrivate: isPrivate || false,
            members: [req.user._id],
            admin: [req.user._id]
        });
        await room.save();
        return res.status(201).json({ message: 'Room created successfully', data: room });
    }
    catch(err) {
        console.error("Error creating room:", err.message);
        return res.status(500).json({message: 'Internal Server error', error: err.message});
    }
});

router.get('/list', async (req,res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({message: 'Room list fetched successfully', data: rooms});
    }
    catch(err){
        console.error("Error fetching rooms:", err.message);
        return res.status(500).json({message: 'Internal Server error', error: err.message});
    }
});

router.post('/join/:roomId', async (req, res) => {
    const {roomId} = req.params;
    if (!roomId) {
        return res.status(400).json({ message: 'Room ID is required' });
    }
    try{
        const room = await Room.findById(roomId);
        if(!room){
            return res.status(404).json({ message: 'Room not found' });
        }
        if(room.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already a member of this room' });
        }
        if(!room.isPrivate){
            room.members.push(req.user._id); // Assuming req.user is set by authentication middleware
            await room.save();
            return res.status(200).json({ message: 'Joined room successfully', data: room });
        }
        return res.status(403).json({ message: 'This is a private room. You need an invitation to join.' });
    }
    catch(err) {
        console.error("Error joining room:", err.message);
        return res.status(500).json({message: 'Internal Server error', error: err.message});
    }
});

router.get('/:roomId', async (req, res) => {
    const {roomId} = req.params;
    if(!roomId){
        return res.status(400).json({ message: 'Room ID is required' });
    }
    try{
        const roomdetails = await Room.findById(roomId).populate('members', 'username'); // Assuming members are User objects
        if(!roomdetails){
            return res.status(404).json({ message: 'Room not found' });
        }
        return res.status(200).json({ message: 'Room details fetched successfully', data: roomdetails });
    }
    catch(err){
        console.error("Error fetching room details:", err.message);
        return res.status(500).json({message: 'Internal Server error', error: err.message});
    }
});

router.put('/add_member', async (req, res) => {
    const {members, roomId} = req.body;
    if(!members || !roomId){
       return res.status(400).json({message: "Member or Room Id missing!"});
    }
    try{
        const room = await Room.findById(roomId);
        console.log('admin ' + room.admin , ' user id ' + req.user._id , '---', room.admin !== req.user._id)
        if(!room)
            return res.status(400).json({message: "No such room exists!"});
        if(room.admin != req.user._id)
            return res.status(400).json({message: "Only admin can add members to the room."});
        room.members.push(...members);
        await room.save();
        return res.status(201).json({message: "Members added successfull !", data: room});
    }
    catch(err){
        console.error("Error adding members to the room ! ", err.message);
        return res.status(500).json({message: 'Internal Server error', error: err.message})
    }
});

 

module.exports = router;
// This code defines routes for creating and fetching chat rooms in a chat application.