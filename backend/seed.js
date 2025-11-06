import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./src/models/User.js";
import { hashPassword } from "./src/utils/hash.js";
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

// Preconfigured accounts (no registration route)
const customers = [
  {
    fullName: "Aisha Naidoo",
    idNumber: "8704021234087",
    accountNumber: "009876543219",
    password: "BlueRiver2025"
  },
  {
    fullName: "Thabo Mokoena",
    idNumber: "9512315807086",
    accountNumber: "001234567891",
    password: "SecurePass123"
  }
];

const employees = [
  { username: "clerk01", password: "ClerkPass123" },
  { username: "supervisor", password: "Sup3rSecure1" }
];

for (const c of customers) {
  const passwordHash = await hashPassword(c.password);
  await User.updateOne(
    { accountNumber: c.accountNumber, role: "customer" },
    { $set: { fullName: c.fullName, idNumber: c.idNumber, passwordHash, role: "customer" } },
    { upsert: true }
  );
}

for (const e of employees) {
  const passwordHash = await hashPassword(e.password);
  await User.updateOne(
    { username: e.username, role: "employee" },
    { $set: { username: e.username, passwordHash, role: "employee", fullName: e.username } },
    { upsert: true }
  );
}

console.log("Seed complete");
await mongoose.disconnect();
