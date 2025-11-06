import { Router } from "express";
import { User } from "../models/User.js";
import { comparePassword } from "../utils/hash.js";
import { signToken } from "../middleware/auth.js";

export const router = Router();

/**
 * POST /api/employee/auth/login
 * body: { username, password }
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!/^[A-Za-z0-9_.\-]{3,32}$/.test(String(username || ""))) {
    return res.status(400).json({ message: "Invalid username" });
  }
  if (!password || /[<>'";]/.test(password)) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const user = await User.findOne({ username, role: "employee" });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  res.json({ token, employee: { id: user._id, username: user.username } });
});
