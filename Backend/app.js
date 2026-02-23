const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// routes
const user = require("./controller/user");
app.use("/api/v2/user", user);

// ❗ correct error middleware
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;