const app = require("./app");
const connectDatabase = require("./db/Database");

// Handling uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);
    process.exit(1);
});

// Load .env from config folder
if (process.env.NODE_ENV !== "PRODUCTION") {
    const result = require("dotenv").config({ path: "./config/.env" });
    if (result.error) {
        console.error("Failed to load .env file:", result.error);
        process.exit(1);
    } else {
        console.log(".env loaded successfully");
        console.log("PORT from env:", process.env.PORT);
    }
}
//connect db
connectDatabase();
// Use fallback port just in case
const PORT = process.env.PORT;

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);

    server.close(() => {
        process.exit(1);
    });
});
