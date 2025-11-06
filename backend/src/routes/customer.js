import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Payment } from "../models/Payment.js";

export const router = Router();

/**
 * POST /api/customer/payments
 * body: { amount, reference }
 */
router.post("/payments", requireAuth("customer"), async (req, res) => {
  const { amount, reference } = req.body || {};
  if (typeof amount !== "number" || !isFinite(amount) || amount <= 0 || amount > 1000000) {
    return res.status(400).json({ message: "Invalid amount" });
  }
  if (!/^[A-Za-z0-9_\-]{3,32}$/.test(String(reference || ""))) {
    return res.status(400).json({ message: "Invalid reference" });
  }
  const payment = await Payment.create({
    customer: req.user.sub,
    amount,
    reference
  });
  res.status(201).json({ ok: true, paymentId: payment._id });
});
