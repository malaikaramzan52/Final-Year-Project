const express = require("express");
const path = require("path");
const router = express.Router();
const { upload } = require("../multer");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");

// CREATE USER
router.post(
  "/create-user",
  upload.single("avatar"), // MUST MATCH FRONTEND
  async (req, res, next) => {
    try {
      console.log("ROUTE HIT");

      const { name, email, password } = req.body;

      // check user exists
      const userEmail = await User.findOne({ email });
      if (userEmail) {
        return next(new ErrorHandler("User already exists", 400));
      }

      // multer file check
      if (!req.file) {
        return next(new ErrorHandler("Avatar is required", 400));
      }

      const filename = req.file.filename;
      const fileUrl = `/uploads/${filename}`;

      const user = {
        name,
        email,
        password,
        avatar: fileUrl,
      };

      console.log("USER DATA:", user);

      // save user
      const newUser = await User.create(user);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: newUser,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
