const express = require("express");
const router = express.Router();

const Category = require("../model/Category");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

/* =========================================================
   GET ALL CATEGORIES
   GET /api/v2/category/all
========================================================= */
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

module.exports = router;
