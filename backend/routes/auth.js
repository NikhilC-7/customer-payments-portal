/* ---- FILE: routes/auth.js ---- */
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// ✅ Static employees (pre-created users)
const employees = [
  {
    username: "admin1",
    passwordHash: bcrypt.hashSync("Admin1234", 10),
    role: "admin",
  },
  {
    username: "staff1",
    passwordHash: bcrypt.hashSync("Staff1234", 10),
    role: "staff",
  },
];

// ----------------------------
// Validators (simple whitelist)
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

function validateLoginInput(req, res, next) {
  const { username, password } = req.body;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: "Invalid username format." });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be 8+ chars, include letters & numbers.",
    });
  }
  next();
}

// ----------------------------
// POST /api/auth/employee/login
router.post("/employee/login", validateLoginInput, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find static user
    const employee = employees.find((u) => u.username === username);
    if (!employee) return res.status(401).json({ message: "Invalid username or password" });

    // Compare password
    const isValid = await bcrypt.compare(password, employee.passwordHash);
    if (!isValid) return res.status(401).json({ message: "Invalid username or password" });

    // Create JWT
    const token = jwt.sign(
      { username: employee.username, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      employee: { username: employee.username, role: employee.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
