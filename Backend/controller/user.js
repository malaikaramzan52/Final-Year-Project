const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");

// Create new user
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // File handling
    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`; // URL to access uploaded file
    }

    // Create user in DB
    const user = await User.create({
      name,
      email,
      password,
      avatar: fileUrl,
    });

    console.log("New user created:", user);

    // Send response back to client
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
