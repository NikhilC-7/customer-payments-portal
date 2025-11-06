// routes/customerAuth.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Customer from "../models/Customer.js";

const router = express.Router();

// Helper: generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

// ---------------------
// REGISTER CUSTOMER
// ---------------------
router.post("/register", async (req, res) => {
  try {
    const { fullName, idNumber, accountNumber, password } = req.body;

    // Validate input
    if (!fullName || !idNumber || !accountNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicates
    const existingCustomer = await Customer.findOne({
      $or: [{ idNumber }, { accountNumber }],
    });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create customer
   const newCustomer = await Customer.create({
  fullName,
  idNumber,
  accountNumber,
  passwordHash: hashedPassword, // ✅ match schema
});

    // Return token
    res.status(201).json({
      message: "Registration successful",
      token: generateToken(newCustomer._id),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// LOGIN CUSTOMER
// ---------------------
router.post("/login", async (req, res) => {
  try {
    const { accountNumber, password } = req.body;

    if (!accountNumber || !password) {
      return res.status(400).json({ message: "Account number and password required" });
    }

    // Find customer
    const customer = await Customer.findOne({ accountNumber });
    if (!customer) {
      return res.status(401).json({ message: "Invalid account number or password" });
    }

    // Compare password
   const isMatch = await bcrypt.compare(password, customer.passwordHash); // ✅ match schema

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid account number or password" });
    }

    // Return token
    res.status(200).json({
      message: "Login successful",
      token: generateToken(customer._id),
      customer: { id: customer._id, fullName: customer.fullName, accountNumber: customer.accountNumber },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
