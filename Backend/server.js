require("dotenv").config({ path: "./config/.env" });

const app = require("./app"); // IMPORT app.js
const mongoose = require("mongoose");

const connectDatabase = require("./db/Database");

// ================== DATABASE ==================
connectDatabase();

// ================== SERVER ==================
const PORT = process.env.PORT || 5000;

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
