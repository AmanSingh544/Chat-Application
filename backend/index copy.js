import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

let message = "";

app.get("/", (req, res) => {
    res.sendFile("C:/Users/aman.singh/Chat APP/index.html");
});

// io.on('connection', (socket) => {  
//     /* Handle socket events here
//     For example, listen for a 'chat message' event from client */
//     socket.on('chat message', ({text, senderId}) => {
//         console.log(`message from client-  ${senderId }: ` + text);
// //console.log(socket.client);
// console.log(JSON.stringify(socket.handshake, null, 2));

// /** Emit the message to all connected clients */
//         io.emit('chat message', {text, senderId});
//     });
//     console.log('A user connected');
// });

/*  send a message to everyone except for a certain emitting socket, 
    we have the broadcast flag for emitting from that socket: */
/*    io.on('connection', (socket) => {
        socket.broadcast.emit('hi');
    });
*/

//---------------------------------------------------
//--------AKNOWLEDGEMENT--------
// send from server to client
io.on('connection', (socket) => {
    // socket.emit('chat message', { text, socket.index }, (err, res) => {
    //     if (err) {
    //         console.error('Error sending message:', err);
    //     }
    //     else {
    //         console.log('Message sent successfully:', res);
    //     }
    // });

    // ---------------------------------------------------
    //  listen from client
    socket.on('chat message', ({ text, senderId }, callback) => {
        console.log(`Message received from ${senderId}: ${text}`);

        io.emit('chat message', { text, senderId });

        if (callback) {
            // Acknowledge the message reception
            callback(null, {
                status: 'success',
                message: 'Message broadcasted to all clients'
            });
        }
    })
});

// ----------------------------- ROOMS ---------------------------------------------
// io.on('connection', (socket) => {
//     // join the room named 'some room'
//     socket.join('some room');

//     // broadcast to all connected clients in the room
//     io.to('some room').emit('hello', 'world');

//     // broadcast to all connected clients except those in the room
//     io.except('some room').emit('hello', 'world');

//     // leave the room
//     socket.leave('some room');
//   });


server.listen(3000, () => {
    console.log("Server is running on port 3000");
});