import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, required: true },
  payeeAccount: { type: String, required: true },
  swiftCode: { type: String },
  description: { type: String },
  status: { type: String, default: "pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  approvedBy: { type: String },
  rejectedBy: { type: String },
  rejectionReason: { type: String },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
