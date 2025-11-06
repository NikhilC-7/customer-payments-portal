import mongoose from "mongoose";

const safeName   = /^[A-Za-z][A-Za-z\s\-]{1,48}[A-Za-z]$/;
const idNumberRe = /^[0-9]{13}$/;
const accountRe  = /^[0-9]{10,12}$/;
const passwordRe = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9._\-!@#]{8,64}$/;

const userSchema = new mongoose.Schema(
  {
    fullName:     { type: String, required: true,  match: safeName },
    idNumber:     { type: String, required: true,  match: idNumberRe },
    accountNumber:{ type: String,                 match: accountRe }, // customers only
    username:     { type: String },                                   // employees only
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ["customer", "employee"], required: true }
  },
  { timestamps: true }
);

// Unique WHEN the field exists (prevents null collisions)
userSchema.index(
  { username: 1 },
  { unique: true, partialFilterExpression: { username: { $exists: true } } }
);
userSchema.index(
  { accountNumber: 1 },
  { unique: true, partialFilterExpression: { accountNumber: { $exists: true } } }
);

export const User = mongoose.model("User", userSchema);
export const validators = { safeName, idNumberRe, accountRe, passwordRe };
