const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    condition: {
      type: String,
      required: true,
      trim: true,
    },
    exchangeable: {
      type: Boolean,
      default: false,
    },
    edition: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Under_Review", "Available", "Reserved", "Sold", "Rejected", "Exchanged"],
      default: "Under_Review",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Book || mongoose.model("Book", bookSchema);
