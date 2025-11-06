import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
customerSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Instance method to verify password
customerSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.models.Customer || mongoose.model("Customer", customerSchema);
