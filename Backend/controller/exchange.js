const express = require("express");
const router = express.Router();
const ExchangeRequest = require("../model/ExchangeRequest");
const Book = require("../model/Book");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");

/* =========================================================
   CREATE EXCHANGE REQUEST
   POST /api/v2/exchange/create-request
   Body: { requestedBookId, offeredBookId }
========================================================= */
router.post(
  "/create-request",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { requestedBookId, offeredBookId } = req.body;

    if (!requestedBookId || !offeredBookId) {
      return next(new ErrorHandler("Requested and offered book IDs are required", 400));
    }

    const requestedBook = await Book.findById(requestedBookId);
    if (!requestedBook) {
      return next(new ErrorHandler("Requested book not found", 404));
    }

    const offeredBook = await Book.findById(offeredBookId);
    if (!offeredBook) {
      return next(new ErrorHandler("Offered book not found", 404));
    }

    // Security checks
    if (offeredBook.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You can only offer your own books", 403));
    }

    if (requestedBook.user.toString() === req.user._id.toString()) {
      return next(new ErrorHandler("You cannot exchange with yourself", 400));
    }

    if (!requestedBook.exchangeable || !offeredBook.exchangeable) {
      return next(new ErrorHandler("Both books must be exchangeable", 400));
    }

    // Check if request already exists
    const existingOld = await ExchangeRequest.findOne({
        requestedBook: requestedBookId,
        offeredBook: offeredBookId,
        status: "Pending"
    });

    if (existingOld) {
        return next(new ErrorHandler("This exchange request already exists", 400));
    }

    const exchangeRequest = await ExchangeRequest.create({
      requestedBook: requestedBookId,
      offeredBook: offeredBookId,
      requester: req.user._id,
      owner: requestedBook.user,
    });

    res.status(201).json({
      success: true,
      exchangeRequest,
    });
  })
);

/* =========================================================
   GET MY SENT EXCHANGE REQUESTS
   GET /api/v2/exchange/my-requests
========================================================= */
router.get(
  "/my-requests",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const requests = await ExchangeRequest.find({ requester: req.user._id })
      .populate("requestedBook")
      .populate("offeredBook")
      .populate("owner", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  })
);

/* =========================================================
   GET RECEIVED EXCHANGE REQUESTS
   GET /api/v2/exchange/received-requests
========================================================= */
router.get(
  "/received-requests",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const requests = await ExchangeRequest.find({ owner: req.user._id })
      .populate("requestedBook")
      .populate("offeredBook")
      .populate("requester", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  })
);

/* =========================================================
   UPDATE EXCHANGE REQUEST STATUS (owner only)
   PUT /api/v2/exchange/:id/status
   Body: { status: "Accepted" | "Rejected" | "Cancelled" }
========================================================= */
router.put(
  "/:id/status",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ["Accepted", "Rejected", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return next(new ErrorHandler("Invalid status", 400));
    }

    const exchangeRequest = await ExchangeRequest.findById(req.params.id);
    if (!exchangeRequest) {
      return next(new ErrorHandler("Exchange request not found", 404));
    }

    // Only owner can accept/reject, requester can cancel
    if (status === "Cancelled") {
      if (exchangeRequest.requester.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("Only requester can cancel the request", 403));
      }
    } else {
      if (exchangeRequest.owner.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("Only book owner can update status", 403));
      }
    }

    exchangeRequest.status = status;
    await exchangeRequest.save();

    res.status(200).json({
      success: true,
      exchangeRequest,
    });
  })
);

module.exports = router;
