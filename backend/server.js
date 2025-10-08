// server.js
import express from "express";
import fs from "fs";
import https from "https";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import hpp from "hpp";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";

console.log("✅ Step 1: Imports loaded");

dotenv.config();
console.log("✅ Step 2: dotenv loaded");

const app = express();
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max requests per IP per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(hpp());
app.use(xss());
app.use(generalLimiter);

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
// Prevent parameter pollution
import hpp from "hpp";
app.use(hpp());

// Sanitize input (against XSS)
import xss from "xss-clean";
app.use(xss());

// Rate limiting (prevents brute-force attacks)
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});
app.use(limiter);

console.log("✅ Step 3: Middleware loaded");

app.use(cors({
  origin: "http://localhost:5173", // React app runs on port 5173
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
console.log("✅ Step 4: Routes loaded");

// HTTPS options
const sslOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
};
console.log("✅ Step 5: SSL files loaded");

// Start HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ Server running on https://localhost:${PORT}`);
});
