const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "../uploads";
    console.log("Multer Request URL:", req.originalUrl);
    if (req.originalUrl.includes("/book")) {
      folder = "../uploads/books";
    } else if (req.originalUrl.includes("/user")) {
      folder = "../uploads/avatars";
    } else if (req.originalUrl.includes("/complaint")) {
      folder = "../uploads/complaints";
    }
    const fullPath = path.normalize(path.join(__dirname, folder));
    console.log("Multer Resolved Path:", fullPath);
    
    // Ensure directory exists
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

exports.upload = multer({ storage });
