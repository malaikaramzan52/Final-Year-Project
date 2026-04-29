const express = require("express");
const router = express.Router();
const Category = require("../model/Category");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated } = require("../middleware/auth");

// GET ALL CATEGORIES
router.get(
  "/all",
  catchAsyncErrors(async (req, res, next) => {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      categories,
    });
  })
);

// CREATE CATEGORY (Admin)
router.post(
  "/admin-create-category",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    if (req.user.role !== "admin") {
      return next(new ErrorHandler("Access denied", 403));
    }
    const { name, description } = req.body;
    
    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      category,
    });
  })
);

// DELETE CATEGORY (Admin)
router.delete(
  "/admin-delete-category/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    if (req.user.role !== "admin") {
      return next(new ErrorHandler("Access denied", 403));
    }
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  })
);

module.exports = router;
