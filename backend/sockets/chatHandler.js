const Message = require("../models/Message");

function setupChatHandlers(io, socket){
    const username = socket.user?.username || 'Anonymous';
    console.log(`User ${username} connected with socket ID: ${socket.id}`);

    socket.broadcast.emit('user connected', {
        username,
        socketId: socket.id
    });

    socket.on('chat message', async ({text, senderId, roomId}, callback) => {
        console.log(`Received message from ${senderId}: ${text}`);
        
        const msg = new Message({text, senderId, roomId, timestamp: new Date()});
        await msg.save();
        
        // Broadcast to room
        io.to(roomId).emit('chat message', {
            text: msg.text,
            senderId: msg.senderId,
            roomId: msg.roomId,
            timestamp: msg.timestamps,
        });

        //io.emit('chat message', msg); // broadcast to every user( client)
        
        callback && callback(null, {
            status: 'ok',
            message: 'Message broadcasted to all clients'
        });
    });

    socket.on('join room', async (roomId) => {
        console.log(`User ${username} joining room: ${roomId}`);
        socket.join(roomId);

        try{
            const history = await Message.find({roomId})
                .sort({createdAt: -1})
                .limit(50)
                .lean();
           // history.reverse(); // to show the oldest messages first

            socket.emit('message history', history.reverse())
        }
        catch(err){
            console.error(`Error fetching message history for room ${roomId}:`, err.message);
            socket.emit('error', { message: 'Failed to fetch message history' });
        }
    });

    socket.on('typing', ({roomId, senderId}) => {
        console.log(`Called typing event - User ${senderId} is typing in room having roomId: ${roomId}}`);
        // Broadcast to room expect the sender
        socket.to(roomId).emit('typing', { senderId, roomId });
    });

    socket.on('typing stopped', ({roomId, senderId}) => {
        console.log(`User ${senderId} stopped typing in room: ${roomId}`);
        
        // Broadcast to room expect the sender
        socket.to(roomId).emit('typing stopped', { senderId, roomId });
    });

    // // Optionally, you can send a welcome message to the user
    // socket.emit('message', {
    //    text: `Welcome to room ${roomId}, ${username}!`,
    //     senderId: 'system',
    //     roomId
    // });

    socket.on('disconnect', () => {
        console.log(`User ${username} disconnected with socket ID: ${socket.id}`);
       
        socket.broadcast.emit('user disconnected', {
            username,
            socketId: socket.id
        });
    });
}

module.exports = { setupChatHandlers };
// This function sets up chat message handling for a Socket.IO connection.