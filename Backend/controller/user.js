const express = require("express");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const { upload } = require("../multer");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");


/* =========================================================
   CREATE USER (SIGN UP)
========================================================= */
router.post(
  "/create-user",
  upload.single("avatar"),
  catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    // Check if user already exists
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      if (req.file?.path) {
        fs.unlink(req.file.path, () => { });
      }
      return next(new ErrorHandler("User already exists", 400));
    }

    // Avatar required
    if (!req.file) {
      return next(new ErrorHandler("Avatar is required", 400));
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      avatar: avatarUrl,
    });

    // Create activation token
    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    // Send activation email
    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `Hello ${user.name}, please click on the link to activate your account:\n\n${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email (${user.email}) to activate your account`,
    });
  })
);

/* =========================================================
   CREATE ACTIVATION TOKEN
========================================================= */
const createActivationToken = (user) => {
  if (!process.env.ACTIVATION_SECRET) {
    throw new Error("ACTIVATION_SECRET is not defined");
  }

  return jwt.sign(
    { id: user._id },
    process.env.ACTIVATION_SECRET,
    { expiresIn: "1h" }
  );
};

/* =========================================================
   LOGIN USER
========================================================= */
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User does not exist", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Please Enter correct Details", 400));
    }

    // Send JWT token
    sendToken(user, 200, res);
  })
);

//Load User
router.get("/getuser", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorHandler("User does not exist", 400));
    }
    res.status(200).json({
      success: true,
      user,
    });
  }
  catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));
module.exports = router;