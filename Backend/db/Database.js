const mongoose = require("mongoose");

const connectDatabase = async () => {
    if (!process.env.MONGODB_URI) {
        console.error("MongoDB Connection Failed: MONGODB_URI is not set in environment variables");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;
