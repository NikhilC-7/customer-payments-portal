import { Router } from "express";
import { User, validators } from "../models/User.js";
import { comparePassword } from "../utils/hash.js";
import { signToken } from "../middleware/auth.js";

export const router = Router();

/**
 * POST /api/auth/login
 * body: { accountNumber, password }
 */
router.post("/login", async (req, res) => {
  const { accountNumber, password } = req.body || {};
  if (!validators.accountRe.test(String(accountNumber || ""))) {
    return res.status(400).json({ message: "Invalid account number" });
  }
  if (!password || /[<>'";]/.test(password)) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const user = await User.findOne({ accountNumber, role: "customer" });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  res.json({ token, customer: { id: user._id, fullName: user.fullName, accountNumber: user.accountNumber } });
});
