import express from "express";
import Payment from "../models/Payment.js"; // MongoDB model
import { requireAuth, requireRole } from "./auth.js";

const router = express.Router();

// ----------------------------
// Validation patterns
// ----------------------------
const accountNumberPattern = /^[0-9]{10,12}$/;
const amountPattern = /^\d+(\.\d{1,2})?$/;
const currencyPattern = /^[A-Z]{3}$/;
const swiftPattern = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
const descriptionPattern = /^[a-zA-Z0-9 ,.'-]{3,100}$/;

// ----------------------------
// CUSTOMER: create payment
// ----------------------------

router.post("/create", requireAuth, async (req, res) => {
  try {
    const { amount, currency, provider, payeeAccount, swiftCode, description } = req.body;

    if (!amountPattern.test(amount)) return res.status(400).json({ message: "Invalid amount format." });
    if (!accountNumberPattern.test(payeeAccount)) return res.status(400).json({ message: "Invalid account number." });
    if (!currencyPattern.test(currency)) return res.status(400).json({ message: "Invalid currency code." });
    if (provider === "SWIFT" && !swiftPattern.test(swiftCode)) return res.status(400).json({ message: "Invalid SWIFT code." });
    if (description && !descriptionPattern.test(description)) return res.status(400).json({ message: "Invalid description." });

    // Save to MongoDB
    const payment = new Payment({
      amount,
      currency,
      provider,
      payeeAccount,
      swiftCode,
      description,
      createdBy: req.user.id, // ✅ store customer ID
    });

    await payment.save();

    res.json({ message: "✅ Payment created successfully", payment });
  } catch (err) {
    console.error("Payment submission error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// ----------------------------
// EMPLOYEE/MANAGER: list pending payments
// ----------------------------
router.get("/pending", requireAuth, requireRole("employee", "manager"), async (req, res) => {
  try {
    const payments = await Payment.find({ status: "pending" });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// EMPLOYEE/MANAGER: approve payment (manager only)
// ----------------------------
router.post("/:id/approve", requireAuth, requireRole("manager"), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "approved";
    payment.approvedBy = req.user.username || req.user.id;
    await payment.save();

    res.json({ success: true, payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// EMPLOYEE/MANAGER: reject payment (manager only)
// ----------------------------
router.post("/:id/reject", requireAuth, requireRole("manager"), async (req, res) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "rejected";
    payment.rejectedBy = req.user.username || req.user.id;
    payment.rejectionReason = reason;
    await payment.save();

    res.json({ success: true, payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
