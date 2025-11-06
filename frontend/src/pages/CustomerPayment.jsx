import React, { useState } from "react";
import api from "../api/api";

const CustomerPayment = () => {
  const [form, setForm] = useState({
    amount: "",
    currency: "USD",
    provider: "SWIFT",
    payeeAccount: "",
    swiftCode: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ----------------------------
  // Validation patterns
  // ----------------------------
  const amountPattern = /^\d+(\.\d{1,2})?$/; // e.g., 1000 or 250.50
  const accountNumberPattern = /^[0-9]{10,12}$/;
  const swiftPattern = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // ----------------------------
    // Client-side validation
    // ----------------------------
    if (!amountPattern.test(form.amount)) return setError("Invalid amount format.");
    if (!accountNumberPattern.test(form.payeeAccount)) return setError("Invalid account number.");
    if (form.provider === "SWIFT" && !swiftPattern.test(form.swiftCode)) return setError("Invalid SWIFT code.");

    try {
      const res = await api.post("/payments/create", form); // token is auto-attached via interceptor

      setMessage(res.data.message);
      setForm({
        amount: "",
        currency: "USD",
        provider: "SWIFT",
        payeeAccount: "",
        swiftCode: "",
        description: "",
      });
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.response?.data?.message || "Server error");
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
        />
        <br /><br />

        <select name="currency" value={form.currency} onChange={handleChange}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="ZAR">ZAR</option>
        </select>
        <br /><br />

        <input
          name="payeeAccount"
          placeholder="Payee Account"
          value={form.payeeAccount}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="swiftCode"
          placeholder="SWIFT Code"
          value={form.swiftCode}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Pay Now</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default CustomerPayment;
