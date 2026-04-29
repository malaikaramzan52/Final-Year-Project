const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server Error";

    // Only log critical 500 errors to avoid terminal clutter
    if (err.statusCode === 500) {
        console.error("Critical Error:", err);
    }


    // wrong mongodb id error
    if (err.name === "CastError") {
        const message = `Resources not found with this id.. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    // wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = `Invalid token. Please login again.`;
        err = new ErrorHandler(message, 401);
    }

    // jwt expired
    if (err.name === "TokenExpiredError") {
        const message = `Session expired. Please login again.`;
        err = new ErrorHandler(message, 401);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};