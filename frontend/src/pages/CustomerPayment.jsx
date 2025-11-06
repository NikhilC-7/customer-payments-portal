import React, { useState } from "react";
import api from "../api/api";

export default function CustomerPayment() {
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const body = { amount: Number(amount), reference };
      const { data } = await api.post("/customer/payments", body);
      if (data.ok) {
        setMsg(`Payment created: ${data.paymentId}`);
        setAmount("");
        setReference("");
      } else setMsg("Payment failed");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2>Make Payment</h2>
      <form onSubmit={submit}>
        <input
          type="number"
          step="0.01"
          min="1"
          max="1000000"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          placeholder="Reference (A-Z,0-9,_,-)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          pattern="[A-Za-z0-9_\-]{3,32}"
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />
        <button type="submit" style={{ padding: "8px 14px" }}>Submit Payment</button>
      </form>
      {msg ? <p style={{ marginTop: 12 }}>{msg}</p> : null}
    </div>
  );
}
