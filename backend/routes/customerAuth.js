import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";

const router = express.Router();

// ----------------------------
// CUSTOMER REGISTRATION
router.post("/register", async (req, res) => {
  const { fullName, idNumber, accountNumber, password } = req.body;

  if (!fullName || !idNumber || !accountNumber || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await Customer.findOne({ accountNumber });
    if (existing) return res.status(400).json({ message: "Account already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      fullName,
      idNumber,
      accountNumber,
      passwordHash: hashedPassword,
    });

    await newCustomer.save();
    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// CUSTOMER LOGIN
router.post("/login", async (req, res) => {
  const { accountNumber, password } = req.body;

  if (!accountNumber || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const customer = await Customer.findOne({ accountNumber });
    if (!customer) return res.status(401).json({ message: "Invalid account number or password" });

    console.log("PasswordHash from DB:", customer.passwordHash);

    const isMatch = await bcrypt.compare(password, customer.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid account number or password" });

    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, customer });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
