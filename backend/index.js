const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const http = require('http');
const connectDB = require('./utils/connectDB');
require('dotenv').config({ path: './.env' });  // Load environment variables from .env file

const authRoutes = require('./routes/authRoutes');
const { verifySocketToken, verifyToken } = require('./middlewares/verifyToken');
const { setupChatHandlers } = require('./sockets/chatHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

connectDB(); // Connect to MongoDB

// Middleware to handle CORS
app.use(cors({
    origin: '*',
    credentials: true
}));

// Middleware to parse JSON requests    
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define routes
app.use('/api/auth', authRoutes);

app.use(verifyToken); // Apply token verification middleware to all routes below this line

app.use('/api/user/room', require('./routes/roomRoutes'))
app.use('/api/user', require('./routes/userRoutes'));

io.use(verifySocketToken); // Verify JWT token for Socket.IO connections
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    setupChatHandlers(io, socket);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

/*
const messages = [];
const onlineUsers = new Set();

io.on('connection', (socket) => {
    const clientId = socket.handshake.auth?.clientId || 'unknown';
    socket.clientId = clientId;

    // send old messages;
    socket.emit('message history', messages);

    // tack online users
    onlineUsers.add(clientId);
    io.emit('online users', Array.from(onlineUsers));

    socket.on('chat message', ({text, senderId}, callback) => {
        const msg = {text, senderId, timestamp: Date.now() };
        messages.push(msg);
        if(messages.length > 100) {
            messages.shift(); // keep only the last 100 messages
        }

        socket.broadcast.emit('chat messsage', msg);
        callback && callback(null,{status: 'ok', message: 'Message broadcasted to all clients'});
    });

    socket.on('disconnect', () => {
        onlineUsers.delete(clientId);
        io.emit('online users', Array.from(onlineUsers));
        console.log(`Client ${clientId} disconnected`);
    });

});

*/

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server is running on port 3000", PORT);
});
// This code sets up a simple chat server using Express and Socket.IO.






// import { ok } from 'assert';
// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';

// const app = express();
// const server = createServer(app);
// const io = new Server(server);

// app.get("/", (req, res) => {
//     res.send(ok("Chat server is running"));
// });

// io.on('connection', (socket) => {
//     socket.on('chat message', ({ text, senderId }, callback) => {
//         console.log(`Message received from ${senderId}: ${text}`);

//         io.emit('chat message', { text, senderId });
//         if (callback) {
//             // Acknowledge the message reception
//             callback(null, {
//                 status: 'success',
//                 message: 'Message broadcasted to all clients'
//             });
//         }
//     })
// });

// server.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });