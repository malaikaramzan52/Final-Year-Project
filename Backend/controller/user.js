const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const { upload } = require("../multer");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt= require("jsonwebtoken");
const sendMail = require("../utils/sendMail");

// CREATE USER
router.post(
  "/create-user",
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // CHECK USER EXISTS
      const userEmail = await User.findOne({ email });
      if (userEmail) {
  if (req.file && req.file.path) {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("File delete error:", err.message);
      }
    });
  }

  return next(new ErrorHandler("User already exists", 400));
}


      if (!req.file) {
        return next(new ErrorHandler("Avatar is required", 400));
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      const user = {
        name,
        email,
        password,
        avatar: fileUrl,
      };
       //create newuser
      const newUser = await User.create(user);
      const activationToken = createActivationToken(user);
      const activationUrl = `http://localhost:3000/activation/${activationToken}`;
      //this try catck block is to send an email
      try{
      await sendMail ({
        email:user.email,
        subject:"Activate your account",
        message:`Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`
      });
      res.status(201).json({
        success:true,
        message:`please check your email:- ${user.email} to activate your account`
      })
          }
      catch(err){
       return next(new ErrorHandler(err.message),500);
      }

    } catch (error) {
      return next(new ErrorHandler(error.message),400);
    }
  }
);

//create Activation Token
const createActivationToken = (user)=>{
  return jwt.sign(user,process.env.ACTIVATION_SECRET,{
  expiresIn:"5m",
  })
}

//activate user 


module.exports = router;
