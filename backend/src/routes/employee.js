import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";

export const router = Router();

/**
 * GET /api/employee/payments
 * returns latest 50 payments with customer info
 */
router.get("/payments", requireAuth("employee"), async (req, res) => {
  const items = await Payment.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .populate({ path: "customer", select: "fullName accountNumber" });
  res.json({ items });
});
