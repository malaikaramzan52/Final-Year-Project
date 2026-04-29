const express = require("express");
const router = express.Router();
const Complaint = require("../model/Complaint");
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
const path = require("path");
const fs = require("fs");

// Create new complaint
router.post(
  "/create-complaint",
  isAuthenticated,
  upload.single("evidence"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { title, category, orderId, description } = req.body;

      let evidence = "";
      if (req.file) {
        evidence = `/uploads/complaints/${req.file.filename}`;
      }

      const complaint = await Complaint.create({
        user: req.user._id,
        title,
        category,
        orderId,
        description,
        evidence,
      });

      res.status(201).json({
        success: true,
        complaint,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all complaints for a user
router.get(
  "/get-all-complaints",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const complaints = await Complaint.find({ user: req.user._id })
        .populate({
          path: "user",
          select: "name email avatar",
          strictPopulate: false
        })
        .sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        complaints,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all complaints (Admin)
router.get(
  "/admin-all-complaints",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return next(new ErrorHandler("Access denied", 403));
      }

      const complaints = await Complaint.find()
        .populate({
          path: "user",
          select: "name email avatar",
          strictPopulate: false
        })
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        complaints,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get single complaint details
router.get(
  "/get-complaint/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const complaint = await Complaint.findById(req.params.id)
        .populate({
          path: "user",
          select: "name email avatar",
          strictPopulate: false
        });

      if (!complaint) {
        return next(new ErrorHandler("Complaint not found", 404));
      }

      res.status(200).json({
        success: true,
        complaint,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);


// Update complaint status (Admin)
router.put(
  "/update-complaint-status/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return next(new ErrorHandler("Only admins can update complaint status", 403));
      }

      const { status, adminResponse } = req.body;

      const complaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        { status, adminResponse, updatedAt: Date.now() },
        { new: true }
      );

      if (!complaint) {
        return next(new ErrorHandler("Complaint not found", 404));
      }

      res.status(200).json({
        success: true,
        complaint,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Delete complaint (Admin)
router.delete(
  "/delete-complaint/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return next(new ErrorHandler("Only admins can delete complaints", 403));
      }

      const complaint = await Complaint.findByIdAndDelete(req.params.id);

      if (!complaint) {
        return next(new ErrorHandler("Complaint not found", 404));
      }

      // Optionally, we could delete the evidence file here using fs.unlink
      if (complaint.evidence) {
        const filePath = path.join(__dirname, "..", complaint.evidence);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.status(200).json({
        success: true,
        message: "Complaint deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;
