import fs from "fs";
import https from "https";
import path from "path";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import Brute from "express-brute";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { router as authRouter } from "./src/routes/auth.js";
import { router as employeeAuthRouter } from "./src/routes/employeeAuth.js";
import { router as customerRouter } from "./src/routes/customer.js";
import { router as employeeRouter } from "./src/routes/employee.js";

dotenv.config();
const app = express();

// --- DB ---
await mongoose.connect(process.env.MONGO_URI);

// --- Security middleware ---
app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: false // API only; CSP is typically enforced by frontend
}));
app.use(hpp());
app.use(mongoSanitize());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// --- CORS ---
app.use(cors({
  origin: [process.env.FRONTEND_ORIGIN],
  credentials: true
}));

// --- Logging ---
app.use(morgan("combined"));

// --- Brute force protection ---
const store = new Brute.MemoryStore();
const bruteGlobal = new Brute(store, {
  freeRetries: 100,
  minWait: 5 * 1000,
  maxWait: 60 * 1000
});
const bruteStrict = new Brute(store, {
  freeRetries: 5,
  minWait: 10 * 1000,
  maxWait: 10 * 60 * 1000
});
app.use(bruteGlobal.prevent);

// --- Routes ---
app.get("/api/health", (req, res) => res.json({ ok: true, https: true }));

// No registration routes. Accounts are seeded.
app.use("/api/auth", bruteStrict.prevent, authRouter);
app.use("/api/employee/auth", bruteStrict.prevent, employeeAuthRouter);
app.use("/api/customer", customerRouter);
app.use("/api/employee", employeeRouter);

// --- HTTPS server ---
const keyPath = process.env.SSL_KEY || "certs/server.key";
const certPath = process.env.SSL_CERT || "certs/server.crt";
const ssl = {
  key: fs.readFileSync(path.resolve(keyPath)),
  cert: fs.readFileSync(path.resolve(certPath))
};

const port = process.env.PORT || 5000;
https.createServer(ssl, app).listen(port, () => {
  console.log(`HTTPS API listening on https://localhost:${port}/api`);
});
