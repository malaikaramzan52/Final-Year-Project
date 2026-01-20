// server.js

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });

const app = express();

// ================== DATABASE CONNECTION ==================
const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

connectDatabase();

// ================== SERVER ==================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// ================== ERROR HANDLING ==================
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.message);
    process.exit(1);
});
