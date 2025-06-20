const { Types } = require("mongoose");
const Message = require("../models/Message");

function setupChatHandlers(io, socket) {
    const username = socket.user?.username || 'Anonymous';
    console.log(`User ${username} connected with socket ID: ${socket.id}`);

    socket.broadcast.emit('user connected', {
        username,
        socketId: socket.id
    });

    socket.on('chat message', async (data, callback) => {
        try {
            const { content, senderId, senderName, roomId, timestamp, status, isOwn } = data;

            // Validate required fields manually (prevent Mongoose error crash)
            if (!content || !roomId || !senderId) {
                const errorMsg = "Missing required fields: content, roomId, or senderId.";
                console.warn(errorMsg, data);
                if (callback) return callback({ error: errorMsg });
                return;
            }

            const newMessage = new Message({
                content,
                senderId,
                senderName,
                roomId,
                timestamp,
                status,
                isOwn,
            });

            await newMessage.save();

            // Emit message to room
            io.to(roomId).emit('chat message', newMessage);

            if (callback) callback(null, { status: 'ok' });
        } catch (err) {
            console.error("Error saving message:", err);

            // Prevent server crash
            if (callback) {
                callback({ error: "Failed to send message." });
            }
        }
    });


    socket.on('join room', async (roomId) => {
        console.log(`User ${username} joining room: ${roomId}`);
        socket.join(roomId);
        try {
            const history = await Message.find({
                roomId: new Types.ObjectId(roomId)
            })
                .sort({ timestamp: -1 })
                .limit(50)
                .lean();
            // history.reverse(); // to show the oldest messages first
            console.log(roomId, '----roomid-----', history)

            socket.emit('message history', history.reverse())
        }
        catch (err) {
            console.error(`Error fetching message history for room ${roomId}:`, err.message);
            socket.emit('error', { message: 'Failed to fetch message history' });
        }
    });

    socket.on('typing', ({ roomId, senderId }) => {
        console.log(`Called typing event - User ${senderId} is typing in room having roomId: ${roomId}}`);
        // Broadcast to room expect the sender
        socket.to(roomId).emit('typing', { senderId, roomId });
    });

    socket.on('typing stopped', ({ roomId, senderId }) => {
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