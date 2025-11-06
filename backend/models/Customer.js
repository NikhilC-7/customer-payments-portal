import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // hashed password
}, { timestamps: true });

export default mongoose.model("Customer", customerSchema);
