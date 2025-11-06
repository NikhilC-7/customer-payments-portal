import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CustomerRegister() {
  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      await api.post("/auth/register", form);
      setMessage("Registered successfully. Redirecting to login...");
      setTimeout(() => navigate("/customer/login"), 800);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2>Customer Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          name="idNumber"
          placeholder="ID Number"
          value={form.idNumber}
          onChange={handleChange}
          required
          minLength={6}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          name="accountNumber"
          placeholder="Account Number"
          value={form.accountNumber}
          onChange={handleChange}
          required
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
          {submitting ? "Submitting..." : "Register"}
        </button>
      </form>
      {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
    </div>
  );
}
