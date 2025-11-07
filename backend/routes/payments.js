import express from "express";
import Payment from "../models/Payment.js"; // MongoDB model
import { requireAuth } from "./auth.js"; // Only used for customers

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
// Helper: static employee key check
// ----------------------------
const verifyStaticEmployee = (req, res, next) => {
  const key = req.headers["x-employee-key"];
  if (key === "valterra123") {
    req.user = { role: "employee", name: "StaticEmployee" };
    return next();
  }
  return res.status(403).json({ message: "Forbidden: Invalid employee key." });
};

// ----------------------------
// CUSTOMER: create payment
// ----------------------------
router.post("/create", requireAuth, async (req, res) => {
  try {
    const { amount, currency, provider, payeeAccount, swiftCode, description } = req.body;

    if (!amountPattern.test(amount))
      return res.status(400).json({ message: "Invalid amount format." });
    if (!accountNumberPattern.test(payeeAccount))
      return res.status(400).json({ message: "Invalid account number." });
    if (!currencyPattern.test(currency))
      return res.status(400).json({ message: "Invalid currency code." });
    if (provider === "SWIFT" && !swiftPattern.test(swiftCode))
      return res.status(400).json({ message: "Invalid SWIFT code." });
    if (description && !descriptionPattern.test(description))
      return res.status(400).json({ message: "Invalid description." });

    const payment = new Payment({
      amount,
      currency,
      provider,
      payeeAccount,
      swiftCode,
      description,
      createdBy: req.user.id,
      status: "pending",
    });

    await payment.save();
    res.json({ message: "✅ Payment created successfully", payment });
  } catch (err) {
    console.error("Payment submission error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// ----------------------------
// EMPLOYEE: get all payments
// ----------------------------
router.get("/", verifyStaticEmployee, async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    console.error("Get payments error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ----------------------------
// EMPLOYEE: approve payment
// ----------------------------
router.patch("/:id/approve", verifyStaticEmployee, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found." });

    payment.verified = true;
    payment.status = "approved";
    payment.verifiedBy = req.user.name;
    await payment.save();

    res.json({ message: "✅ Payment approved", payment });
  } catch (err) {
    console.error("Approve payment error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ----------------------------
// EMPLOYEE: reject payment
// ----------------------------
router.patch("/:id/reject", verifyStaticEmployee, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found." });

    const { reason } = req.body;
    if (!reason || reason.length < 3) {
      return res.status(400).json({ message: "Rejection reason is required." });
    }

    payment.status = "rejected";
    payment.rejectionReason = reason;
    payment.verifiedBy = req.user.name;
    payment.verified = false;

    await payment.save();
    res.json({ message: "✅ Payment rejected", payment });
  } catch (err) {
    console.error("Reject payment error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
