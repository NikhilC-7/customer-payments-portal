import express from "express";
import fs from "fs";
import https from "https";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { RateLimiterMemory } from "rate-limiter-flexible";

import authRoutes from "./routes/auth.js";
import employeeAuthRoutes from "./routes/employeeAuth.js";
import customerAuthRoutes from "./routes/customerAuth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------------
// CONNECT TO MONGODB
// ----------------------------
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Cluster0";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


// ----------------------------
// SECURITY MIDDLEWARE
// ----------------------------
app.use(hpp());
app.use(helmet());

// ----------------------------
// CORS (allow local frontend)
// ----------------------------

app.use(
  cors({
    origin: ["http://localhost:5173", "https://localhost:5173"],
    credentials: true,
  })
);

// ----------------------------
// BODY PARSING
// ----------------------------
app.use(express.json());

// ----------------------------
// RATE LIMITING
// ----------------------------
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, try again later.",
});
app.use(generalLimiter);

const loginLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,
});

// ----------------------------
// ROUTES
// ----------------------------
app.use("/api/auth", customerAuthRoutes);
app.use("/api/employee/auth", employeeAuthRoutes);

// Optional test route
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Secure backend is running correctly!" });
});

// ----------------------------
// HTTPS SERVER
// ----------------------------
const sslOptions = {
  key: fs.readFileSync("./localhost+2-key.pem"),
  cert: fs.readFileSync("./localhost+2.pem"),
};

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ Server running securely at: https://localhost:${PORT}`);
});
