import React, { useState } from "react";
import api, { setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CustomerLogin({ onLogin }) {
  const [form, setForm] = useState({ accountNumber: "", password: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/login", form);
      setAuthToken(data.token);
      onLogin?.(data.customer);
      navigate("/customer/payment");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2>Customer Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="accountNumber"
          placeholder="Account Number"
          value={form.accountNumber}
          onChange={handleChange}
          required
          pattern="[0-9]{10,12}"
          title="10–12 digits"
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />
        <button type="submit" disabled={submitting} style={{ padding: "8px 14px" }}>
          {submitting ? "Signing in..." : "Login"}
        </button>
      </form>
      {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
    </div>
  );
}
