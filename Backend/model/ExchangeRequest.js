const mongoose = require("mongoose");

const exchangeRequestSchema = new mongoose.Schema(
  {
    requestedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    offeredBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Cancelled", "Exchanged"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExchangeRequest", exchangeRequestSchema);
