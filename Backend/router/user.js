const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createUser, activateUser } = require("../controller/userController");

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure uploads/ folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// POST /api/users/create-user
router.post("/create-user", upload.single("avatar"), createUser);

router.post("/activation", activateUser);

module.exports = router;