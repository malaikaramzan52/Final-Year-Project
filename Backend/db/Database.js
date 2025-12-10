
const mongoose = require("mongoose");

const connectDatabase = async () => {
 mongoose.connect(process.env.DB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

};

module.exports = connectDatabase;