import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, min: 1, max: 1000000, required: true },
  reference: { type: String, required: true, match: /^[A-Za-z0-9_\-]{3,32}$/ }
}, { timestamps: true });

export const Payment = mongoose.model("Payment", paymentSchema);
