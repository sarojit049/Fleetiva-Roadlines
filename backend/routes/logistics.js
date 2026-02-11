const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/combinedAuth");
const Load = require("../models/Load");
const Booking = require("../models/Booking");

/* ================= CUSTOMER LOADS ================= */
router.get(
  "/customer/loads",
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const loads = await Load.find({ customer: userId })
        .sort({ createdAt: -1 })
        .lean();
      res.json(loads);
    } catch (err) {
      console.error("❌ Customer loads error:", err);
      res.status(500).json({ message: "Failed to fetch loads" });
    }
  }
);

/* ================= CUSTOMER BOOKINGS ================= */
router.get(
  "/customer/bookings",
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const bookings = await Booking.find({ customer: userId })
        .populate("load", "material requiredCapacity")
        .populate("driver", "name phone")
        .sort({ createdAt: -1 })
        .lean();
      res.json(bookings);
    } catch (err) {
      console.error("❌ Customer bookings error:", err);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  }
);

module.exports = router;
