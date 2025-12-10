const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

/* ============================
   CREATE USER (SEND EMAIL ONLY)
=============================== */
exports.createUser = async (req, res, next) => {
  try {
    // ✅ Debug: confirm request data
    console.log("✅ Request body:", req.body);
    console.log("✅ Request file:", req.file);

    const { name, email, password } = req.body;
    const avatar = req.file ? req.file.filename : null;

    // ✅ Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Check if already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create activation token (NO DB SAVE)
    const activationToken = createActivationToken({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    // ✅ Send activation email
    await sendMail({
      email,
      subject: "Activate your account",
      message: `Hello ${name},\n\nPlease click the link below to activate your account:\n\n${activationUrl}\n\nThank you!`,
    });

    return res.status(201).json({
      success: true,
      message: `Please check your email (${email}) to activate your account`,
    });

  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   CREATE ACTIVATION TOKEN
=============================== */
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "1h",
  });
};

/* ============================
   ACTIVATE USER (SAVE TO DB)
=============================== */
exports.activateUser = catchAsyncErrors(async (req, res, next) => {
  const { activation_token } = req.body;

  if (!activation_token) {
    return next(new ErrorHandler("Activation token is required", 400));
  }

  let decoded;

  try {
    decoded = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Activation link expired", 400));
    }
    return next(new ErrorHandler("Invalid activation token", 400));
  }

  const { name, email, password, avatar } = decoded;

  // ✅ Check again before saving
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already activated", 400));
  }

  // ✅ Save user now (ONLY ON ACTIVATION)
  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  // ✅ Send JWT login token
  sendToken(user, 201, res);
});
