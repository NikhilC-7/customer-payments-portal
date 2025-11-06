// CustomerPayment.jsx
import React, { useState } from "react";
import api from "../api/api";
import { amountPattern, accountNumberPattern, swiftPattern } from "../utils/validators";

const CustomerPayment = () => {
  const [form, setForm] = useState({
    amount: "",
    currency: "USD",
    provider: "SWIFT",
    payeeAccount: "",
    swiftCode: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Client-side validation
    if (!amountPattern.test(form.amount)) return setError("Invalid amount (e.g., 1000 or 250.50).");
    if (!accountNumberPattern.test(form.payeeAccount)) return setError("Invalid account number (10–12 digits).");
    if (!swiftPattern.test(form.swiftCode)) return setError("Invalid SWIFT code.");

    try {
      // ✅ Attempt request
      const res = await api.post("/payments/create", form);

      // ✅ Safely check for response
      if (res && res.data) {
        setMessage("✅ Payment submitted successfully");
        setForm({
          amount: "",
          currency: "USD",
          provider: "SWIFT",
          payeeAccount: "",
          swiftCode: "",
        });
      } else {
        setError("⚠️ Server did not respond correctly. Please try again.");
      }
    } catch (err) {
      console.error("Payment submission error:", err);
      setError(err.response?.data?.message || "Server error. Please try again later.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>Make a Payment</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        /><br/><br/>

        <select name="currency" value={form.currency} onChange={handleChange}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="ZAR">ZAR</option>
        </select><br/><br/>

        <select name="provider" value={form.provider} onChange={handleChange}>
          <option value="SWIFT">SWIFT</option>
        </select><br/><br/>

        <input
          name="payeeAccount"
          placeholder="Payee Account"
          value={form.payeeAccount}
          onChange={handleChange}
          required
        /><br/><br/>

        <input
          name="swiftCode"
          placeholder="SWIFT Code"
          value={form.swiftCode}
          onChange={handleChange}
          required
        /><br/><br/>

        <button type="submit">Pay Now</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default CustomerPayment;
    