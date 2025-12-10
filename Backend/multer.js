const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { createUser } = require("./controller/userController");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
// In your route:
router.post("/create-user", upload.single("avatar"), createUser);

module.exports = router;