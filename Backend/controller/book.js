const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const Book = require("../model/Book");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");
const { upload } = require("../multer");

/* =========================================================
   GET ALL BOOKS (all except Rejected)
   GET /api/v2/book/all
   Query: ?category=id&sort=latest|oldest|price_asc|price_desc
========================================================= */
router.get(
  "/all",
  catchAsyncErrors(async (req, res, next) => {
    // Show all books except Rejected — status badge shows current state
    const filter = { status: { $ne: "Rejected" } };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.exchangeable === "true") {
      filter.exchangeable = true;
    }

    let sortOption = { createdAt: -1 };
    switch (req.query.sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
    }

    const books = await Book.find(filter)
      .populate("category", "name")
      .populate("user", "name email avatar")
      .sort(sortOption);

    res.status(200).json({
      success: true,
      books,
    });
  })
);

/* =========================================================
   SEARCH BOOKS
   GET /api/v2/book/search?q=term
========================================================= */
router.get(
  "/search",
  catchAsyncErrors(async (req, res, next) => {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(200).json({ success: true, books: [] });
    }

    const regex = new RegExp(q, "i");

    const books = await Book.find({
      status: { $ne: "Rejected" },
      $or: [{ title: regex }, { author: regex }],
    })
      .populate("category", "name")
      .populate("user", "name email avatar")
      .limit(10);

    res.status(200).json({
      success: true,
      books,
    });
  })
);

/* =========================================================
   GET BOOKS BY CATEGORY (for suggested/related books)
   GET /api/v2/book/category/:categoryId
   NOTE: Must be defined BEFORE /:id to avoid route conflicts
========================================================= */
router.get(
  "/category/:categoryId",
  catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find({
      category: req.params.categoryId,
      status: "Available",
    })
      .populate("category", "name")
      .populate("user", "name email avatar")
      .limit(10);

    res.status(200).json({
      success: true,
      books,
    });
  })
);

/* =========================================================
   GET MY BOOKS (books uploaded by current user)
   GET /api/v2/book/user/my-books
   NOTE: Must be defined BEFORE /:id to avoid route conflicts
========================================================= */
router.get(
  "/user/my-books",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find({ user: req.user._id })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      books,
    });
  })
);

// Admin: Get all books
router.get(
  "/admin-all-books",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return next(new ErrorHandler("Access denied", 403));
      }
      const books = await Book.find()
        .populate("category", "name")
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        books,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

/* =========================================================
   GET SINGLE BOOK (with seller info)
   GET /api/v2/book/:id
   NOTE: This wildcard route must be LAST among GET routes
========================================================= */

router.get(
  "/:id",
  catchAsyncErrors(async (req, res, next) => {
    const book = await Book.findById(req.params.id)
      .populate("category", "name")
      .populate("user", "name email avatar createdAt");

    if (!book) {
      return next(new ErrorHandler("Book not found", 404));
    }

    res.status(200).json({
      success: true,
      book,
    });
  })
);

/* =========================================================
   CREATE BOOK (upload/become seller)
   POST /api/v2/book/create
========================================================= */
router.post(
  "/create",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    const { title, author, description, price, category, condition, exchangeable, edition } =
      req.body;

    if (!title || !description || !price || !category || !condition) {
      return next(new ErrorHandler("Please fill all required fields", 400));
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/books/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      return next(new ErrorHandler("Book image is required", 400));
    }

    const book = await Book.create({
      user: req.user._id,
      title,
      author,
      description,
      price: Number(price),
      category,
      condition,
      exchangeable: exchangeable === "true" || exchangeable === true,
      edition: edition || "",
      image: imageUrl,
      status: "Available",
    });

    await book.populate([
      { path: "category", select: "name" },
      { path: "user", select: "name email avatar" },
    ]);

    res.status(201).json({
      success: true,
      book,
    });
  })
);

/* =========================================================
   UPDATE BOOK
   PUT /api/v2/book/:id
========================================================= */
router.put(
  "/:id",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(new ErrorHandler("Book not found", 404));
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You can only edit your own books", 403));
    }

    const { title, author, description, price, category, condition, exchangeable, edition, status } =
      req.body;

    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;
    if (price) book.price = Number(price);
    if (category) book.category = category;
    if (condition) book.condition = condition;
    if (edition !== undefined) book.edition = edition;
    if (exchangeable !== undefined) {
      book.exchangeable = exchangeable === "true" || exchangeable === true;
    }
    if (status && ["Available", "Under_Review", "Reserved", "Sold", "Exchanged"].includes(status)) {
      book.status = status;
    }

    if (req.file) {
      book.image = `/uploads/books/${req.file.filename}`;
    }

    await book.save();

    await book.populate([
      { path: "category", select: "name" },
      { path: "user", select: "name email avatar" },
    ]);

    res.status(200).json({
      success: true,
      book,
    });
  })
);

/* =========================================================
   DELETE BOOK
   DELETE /api/v2/book/:id
========================================================= */
router.delete(
  "/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(new ErrorHandler("Book not found", 404));
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You can only delete your own books", 403));
    }

    if (book.status === "Sold" || book.status === "Exchanged") {
      return next(new ErrorHandler("Cannot delete a book that has been sold or exchanged", 400));
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  })
);


// Admin: Delete book
router.delete(
  "/admin-delete-book/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return next(new ErrorHandler("Access denied", 403));
      }
      const book = await Book.findById(req.params.id);
      if (!book) {
        return next(new ErrorHandler("Book not found", 404));
      }

      // Optionally delete book image
      if (book.image && book.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "..", book.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      await Book.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;

