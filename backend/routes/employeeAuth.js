// routes/employeeAuth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const router = express.Router();

// 🧑‍💼 Hardcoded employee accounts (no registration allowed)
const employees = [
  {
    id: 1,
    username: "admin",
    password: bcrypt.hashSync("Admin@123", 10), // hashed password
    role: "admin",
  },
  {
    id: 2,
    username: "staff1",
    password: bcrypt.hashSync("Staff@123", 10),
    role: "staff",
  },
];

// 🧩 LOGIN Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🧼 Whitelist input using RegEx
    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
   const passwordPattern =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/;

    if (!usernamePattern.test(username) || !passwordPattern.test(password)) {
      return res.status(400).json({ message: "Invalid input format." });
    }

    const employee = employees.find((emp) => emp.username === username);
    if (!employee)
      return res.status(404).json({ message: "User not found." });

    // Compare hashed password
    const validPassword = await bcrypt.compare(password, employee.password);
    if (!validPassword)
      return res.status(401).json({ message: "Incorrect password." });

    // Generate JWT token
    const token = jwt.sign(
      { id: employee.id, username: employee.username, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Employee login successful!",
      token,
      role: employee.role,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
