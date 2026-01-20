const express = require("express");
const app = express();

// config
require("dotenv").config({
    path: "./config/.env"
});

module.exports = app;
