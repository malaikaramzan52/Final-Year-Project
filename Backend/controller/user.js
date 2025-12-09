const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

exports.createUser = async (req, res, next) => {
  try {
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILE:", req.file);

    const { name, email, password } = req.body;
    const avatar = req.file ? req.file.filename : null;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });
    await user.save();

    const activationToken = createActivationToken(user);


    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
       await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
       });
       res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
        user
       });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500))
    }

  
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// create activation token
const createActivationToken = (user) => {
return jwt.sign(
  {
    name: user.name,
    email: user.email,
    password: user.password,
    avatar: user.avatar,
   }, 
  process.env.ACTIVATION_SECRET, {
    expiresIn: "1h",
  });
};

// activate user

exports.activateUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    if (!activation_token) {
      return next(new ErrorHandler("No token provided", 400));
    }

    const decoded = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );

    const { name, email, password, avatar } = decoded;

    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }

    user = await User.create({
      name,
      email,
      password,
      avatar,
    });

    sendToken(user, 201, res);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Your token is expired", 400));
    }
    return next(new ErrorHandler(error.message, 500));
  }
});