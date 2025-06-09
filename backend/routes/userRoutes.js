const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/alluser', async (req, res) => {
    try{
        const allUser = await User.find().select('_id username');
        return res.status(200).json({message: "", data: allUser})
    }
    catch(err){
        console.error("Error fetching all Uers!", err.message);
        res.status(500).json({message: "Internal Server Error !", error : err.message})
    }
});

module.exports = router;