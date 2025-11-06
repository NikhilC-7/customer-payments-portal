    import express from "express";
    import jwt from "jsonwebtoken";
    import bcrypt from "bcryptjs";
    import Customer from "../models/Customer.js";

    const router = express.Router();

    // ----------------------------
    // STATIC EMPLOYEES
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
    // EMPLOYEE LOGIN VALIDATION
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    function validateEmployeeLogin(req, res, next) {
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
    // EMPLOYEE LOGIN ROUTE
    router.post("/employee/login", validateEmployeeLogin, async (req, res) => {
    try {
        const { username, password } = req.body;

        const employee = employees.find((u) => u.username === username);
        if (!employee) return res.status(401).json({ message: "Invalid username or password" });

        const isValid = await bcrypt.compare(password, employee.passwordHash);
        if (!isValid) return res.status(401).json({ message: "Invalid username or password" });

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
        password: hashedPassword,
        });

        await newCustomer.save();
        res.json({ message: "Registration successful" });
    } catch (err) {
        console.error(err);
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

        const isMatch = await bcrypt.compare(password, customer.passwordHash);
        if (!isMatch) return res.status(401).json({ message: "Invalid account number or password" });

        const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, customer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
    });
    // auth.js
export function requireAuth(req, res, next) {
  // Example: verify JWT from headers
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
}


    export default router;
