const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please enter complaint title!"],
  },
  category: {
    type: String,
    required: [true, "Please select a category!"],
    enum: [
      "Book Not Received",
      "Wrong Book Delivered",
      "Payment Issue",
      "Seller Misbehavior",
      "Exchange Issue",
      "Other",
    ],
  },
  orderId: {
    type: String,
  },
  description: {
    type: String,
    required: [true, "Please enter complaint description!"],
  },
  evidence: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved", "Rejected"],
    default: "Pending",
  },
  adminResponse: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);
