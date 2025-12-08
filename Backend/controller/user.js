const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");

// ======================================
// Create new user (Send Activation Email)
// ======================================
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      // Delete uploaded file if exists
      if (req.file) {
        const filePath = path.join("uploads", req.file.filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
      return next(new ErrorHandler("User already exists", 400));
    }

    // File handling
    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`; // URL to access uploaded file
    }

    // Prepare user data for activation token
    const user = { name, email, password, avatar: fileUrl };

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click the link to activate your account: ${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account!`,
      });
    } catch (err) {
      return next(new ErrorHandler("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
});

// ======================================
// Create Activation Token
// ======================================
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
};

// ======================================
// Activate user and save to DB
// ======================================
router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    try {
     const { activationToken } = useParams();

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid activation token", 400));
      }

      const { name, email, password, avatar } = newUser;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      // Create user in DB (THIS WAS MISSING IN YOUR CODE)
      user = await User.create({
        name,
        email,
        password,
        avatar: avatar || null,
      });

      console.log("User saved successfully:", user);

      // Send JWT token
      sendToken(user, 201, res);
    } catch (error) {
      console.error("Activation error:", error);
      return next(new ErrorHandler("Token expired or invalid", 400));
    }
  })
);


module.exports = router;
