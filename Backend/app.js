const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000", // frontend URL
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// routes
const user = require("./controller/user");
const order = require("./controller/order");
const book = require("./controller/book");
const category = require("./controller/category");
const exchange = require("./controller/exchange");
const complaint = require("./controller/complaint");
const analytics = require("./controller/analytics");


app.use("/api/v2/user", user);
app.use("/api/v2/order", order);
app.use("/api/v2/book", book);
app.use("/api/v2/category", category);
app.use("/api/v2/exchange", exchange);
app.use("/api/v2/complaint", complaint);
app.use("/api/v2/analytics", analytics);



// ❗ correct error middleware
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;