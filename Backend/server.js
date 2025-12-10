require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDatabase = require("./db/Database"); // Database connection function

// -------------------------
// 1. LOAD ENVIRONMENT VARIABLES
// -------------------------
// Ensure .env file is loaded correctly from the root directory
dotenv.config({ path: path.resolve(__dirname, ".env") });

// -------------------------
// 2. CONNECT TO DATABASE
// -------------------------
connectDatabase(); // If connection fails, server will throw an error

// -------------------------
// 3. INITIALIZE EXPRESS APP
// -------------------------
const app = express();

// -------------------------
// 4. MIDDLEWARE
// -------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------
// 5. ROUTES
// -------------------------
const userRouter = require(path.join(__dirname, "router", "user"));
app.use("/api/users", userRouter);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => res.send("Server running..."));

const userRoutes = require("./router/user");
app.use("/api/users", userRoutes);


// -------------------------
// 6. START SERVER
// -------------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});