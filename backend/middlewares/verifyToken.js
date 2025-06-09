const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
};

function verifyToken(req, res, next) {
    const authheader = req.headers['authorization'];
    if (!authheader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authheader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    });
}


function verifySocketToken(socket, next) {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error('Token is missing'));
    }
    if (!token || typeof token !== 'string') {
        return next(new Error('Authentication error: Token missing or invalid'));
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Invalid token'));
        }
        socket.user = decoded; // Attach user info to socket object
        next(); // Proceed to the next middleware or event handler
    });
}

module.exports = { verifyToken, verifySocketToken };
// This code defines middleware functions to verify JWT tokens for HTTP requests and Socket.IO connections.