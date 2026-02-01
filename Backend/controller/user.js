const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { upload } = require("../multer");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");

/* =========================================================
   CREATE USER  (SEND EMAIL – DO NOT SAVE IN DB)
========================================================= */
router.post(
  "/create-user",
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        if (req.file?.path) fs.unlinkSync(req.file.path);
        return next(new ErrorHandler("User already exists", 400));
      }

      if (!req.file) {
        return next(new ErrorHandler("Avatar is required", 400));
      }

      const avatar = `/uploads/${req.file.filename}`;

      // Create activation token (contains user data)
      const activationToken = createActivationToken({
        name,
        email,
        password,
        avatar,
      });

      const activationUrl = `http://localhost:3000/activation/${activationToken}`;

      // Send activation email
      await sendMail({
        email,
        subject: "Activate your account",
        message: `Hello ${name},\n\nPlease click the link below to activate your account:\n${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${email} to activate your account`,
      });

    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/* =========================================================
   ACTIVATE USER  (SAVE TO DB AFTER EMAIL VERIFY)
========================================================= */
router.post("/activation/:token", async (req, res, next) => {
  try {
    const { token } = req.params;

    // Verify token
    const decoded = jwt.verify(token, process.env.ACTIVATION_SECRET);

    const { name, email, password, avatar } = decoded.user;

    // Check again if user already activated
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorHandler("Account already activated", 400));
    }

    // Save user to DB
    const user = await User.create({
      name,
      email,
      password,
      avatar,
    });

    res.status(201).json({
      success: true,
      message: "Account activated successfully",
      user,
    });

  } catch (error) {
    return next(
      new ErrorHandler("Activation link is expired or invalid", 400)
    );
  }
});

/* =========================================================
   CREATE ACTIVATION TOKEN
========================================================= */
const createActivationToken = (user) => {
  return jwt.sign(
    { user },
    process.env.ACTIVATION_SECRET,
    {
      expiresIn: "24h",
    }
  );
};

module.exports = router;
// Allah