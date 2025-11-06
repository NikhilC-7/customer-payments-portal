import Customer from "../models/Customer.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

export const registerCustomer = async (req, res) => {
  try {
    const { fullName, idNumber, accountNumber, password } = req.body;

    if (!fullName || !idNumber || !accountNumber || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Prevent duplicates
    const existing = await Customer.findOne({
      $or: [{ idNumber }, { accountNumber }],
    });
    if (existing)
      return res.status(400).json({ message: "Customer already registered" });

    const newCustomer = await Customer.create({
      fullName,
      idNumber,
      accountNumber,
      passwordHash: password, // will trigger pre-save hashing
    });

    res.status(201).json({
      message: "Registration successful",
      token: generateToken(newCustomer._id),
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { accountNumber, password } = req.body;

    if (!accountNumber || !password)
      return res.status(400).json({ message: "All fields are required" });

    const customer = await Customer.findOne({ accountNumber });
    if (!customer)
      return res.status(401).json({ message: "Invalid account number or password" });

    const isValid = await customer.verifyPassword(password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid account number or password" });

    res.status(200).json({
      message: "Login successful",
      token: generateToken(customer._id),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
