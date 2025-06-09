const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    try {
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ _id: newUser._id, username: username }, JWT_SECRET);
        res.status(201).json({ token, user: { _id: newUser._id, username: newUser.username }, success: true  });
    }
    catch (err) {
        console.error("Error during signup:", err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt with username:", username);
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        req.user  = user; // Attach user to response object for further use

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ _id: user._id, username: user.username }, JWT_SECRET);
        res.json({ token, user: { _id: user._id, username: user.username }, success: true });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
// This code sets up authentication routes for user signup and login using JWT and bcrypt.