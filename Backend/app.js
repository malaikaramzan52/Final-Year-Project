const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorMiddleware = require("./utils/errorMiddleware");
const userRoutes = require("./router/user");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(cookieParser());

// LOAD ENV
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: path.join(__dirname, "config/.env") });
}

// ROUTES
app.use("/api/users", userRoutes);

// ERROR HANDLING
app.use(errorMiddleware);

module.exports = app;