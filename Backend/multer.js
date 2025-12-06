const multer = require("multer");
const path = require("path"); // ✅ Make sure path is imported

// Ensure the uploads folder exists
const fs = require("fs");
const uploadDir = path.join(__dirname, "./uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Keep original file extension
    const name = file.originalname.replace(ext, "").replace(/\s+/g, "-");
    cb(null, name + "-" + uniqueSuffix + ext);
  },
});

exports.upload = multer({ storage });
