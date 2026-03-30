const express = require("express");
const router = express.Router();

const Order = require("../model/Order");
const Book = require("../model/Book");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");

/* =========================================================
   CREATE ORDER
   POST /api/v2/order/create
   Body: { bookId, shippingAddress: { fullName, phone, address, city, zip } }
========================================================= */
router.post(
  "/create",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { bookId, shippingAddress } = req.body;

    if (!bookId || !shippingAddress) {
      return next(new ErrorHandler("Book ID and shipping address are required", 400));
    }

    const { fullName, phone, address, city } = shippingAddress;
    if (!fullName || !phone || !address || !city) {
      return next(new ErrorHandler("Please fill all required shipping fields", 400));
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return next(new ErrorHandler("Book not found", 404));
    }

    if (book.status !== "Available") {
      return next(new ErrorHandler("This book is no longer available", 400));
    }

    if (book.user.toString() === req.user._id.toString()) {
      return next(new ErrorHandler("You cannot buy your own book", 400));
    }

    // Create the order
    const order = await Order.create({
      book: book._id,
      buyer: req.user._id,
      seller: book.user,
      price: book.price,
      shippingAddress,
      paymentMethod: "COD",
    });

    // Mark book as sold
    book.status = "Sold";
    await book.save();

    // Populate for response
    await order.populate([
      { path: "book", select: "title author image price" },
      { path: "buyer", select: "name email" },
      { path: "seller", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      order,
    });
  })
);

/* =========================================================
   GET MY ORDERS (as buyer)
   GET /api/v2/order/my-orders
========================================================= */
router.get(
  "/my-orders",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("book", "title author image price")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  })
);

/* =========================================================
   GET SELLER ORDERS (orders for books I'm selling)
   GET /api/v2/order/seller-orders
========================================================= */
router.get(
  "/seller-orders",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ seller: req.user._id })
      .populate("book", "title author image price")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  })
);

/* =========================================================
   UPDATE ORDER STATUS (seller only)
   PUT /api/v2/order/:id/status
   Body: { status: "Confirmed" | "Shipped" | "Delivered" | "Cancelled" }
========================================================= */
router.put(
  "/:id/status",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { status } = req.body;

    const validStatuses = ["Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return next(new ErrorHandler("Invalid status", 400));
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    // Only seller can update status
    if (order.seller.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You are not authorized to update this order", 403));
    }

    // If cancelling, make book available again
    if (status === "Cancelled" && order.status !== "Cancelled") {
      const book = await Book.findById(order.book);
      if (book) {
        book.status = "Available";
        await book.save();
      }
    }

    order.status = status;
    await order.save();

    await order.populate([
      { path: "book", select: "title author image price" },
      { path: "buyer", select: "name email" },
      { path: "seller", select: "name email" },
    ]);

    res.status(200).json({
      success: true,
      order,
    });
  })
);

module.exports = router;
