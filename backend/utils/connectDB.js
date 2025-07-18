const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    }
    catch(err){
        console.error("MongoDB connection failed:", err.message);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectDB;
// This code defines a function to connect to MongoDB using Mongoose.