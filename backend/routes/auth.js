// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { RateLimiterMemory } from "rate-limiter-flexible";

dotenv.config();
const router = express.Router();

// ✅ Regex patterns for whitelisting input
const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

// ✅ Temporary in-memory user store (replace with database later)
let users = [];

// ✅ Rate limiter setup (prevents brute-force & DoS attacks)
const limiterSlowBruteByIP = new RateLimiterMemory({
  points: 5,           // 5 attempts
  duration: 15 * 60,   // per 15 minutes
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMemory({
  points: 5,           // 5 failed logins allowed
  duration: 60 * 60,   // per hour
});

/**
 * ✅ REGISTER route
 * - Validates username/password using regex
 * - Hashes password with bcrypt
 * - Stores the user securely (in memory for now)
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Whitelist check
    if (!usernamePattern.test(username)) {
      return res.status(400).json({ message: "Invalid username format." });
    }
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message: "Password must be 8+ chars long, include letters and numbers.",
      });
    }

    // Check for duplicate usernames
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // Hash password with bcrypt (with salt)
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: "✅ User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ✅ LOGIN route
 * - Validates input and limits brute-force attempts
 * - Returns signed JWT on success
 */
router.post("/login", async (req, res) => {
  const ipAddr = req.ip;
  const { username, password } = req.body;

  const keyUsernameIP = `${username}_${ipAddr}`;

  try {
    // Consume 1 point for IP (limit brute-force)
    await limiterSlowBruteByIP.consume(ipAddr);
    await limiterConsecutiveFailsByUsernameAndIP.consume(keyUsernameIP);

    // Whitelist check
    if (!usernamePattern.test(username) || !passwordPattern.test(password)) {
      return res.status(400).json({ message: "Invalid credentials format." });
    }

    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // ✅ Reset limiter counters on successful login
    await limiterSlowBruteByIP.delete(ipAddr);
    await limiterConsecutiveFailsByUsernameAndIP.delete(keyUsernameIP);

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "✅ Login successful", token });
  } catch (rlRejected) {
    if (rlRejected instanceof Error) {
      // Server / limiter error
      return res.status(500).json({ message: "Server error", error: rlRejected.message });
    } else {
      // Too many requests — send Retry-After header
      const retrySecs = Math.round(rlRejected.msBeforeNext / 1000) || 1;
      res.set("Retry-After", String(retrySecs));
      return res.status(429).json({
        message: `Too many login attempts. Retry after ${retrySecs} seconds.`,
      });
    }
  }
});

/**
 * ✅ PROTECTED route
 * - Requires valid JWT to access
 */
router.get("/dashboard", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided." });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid or expired token." });
      res.json({ message: `Welcome ${user.username}! 🎉 This is your secure dashboard.` });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
