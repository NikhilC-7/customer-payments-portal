import React, { useState } from "react";
import api, { setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function EmployeeLogin({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await api.post("/employee/auth/login", form);
      setAuthToken(res.data.token);
      onLogin?.(res.data.employee);
      navigate("/employee/portal");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2>Employee Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
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
          {submitting ? "Signing in..." : "Login"}
        </button>
      </form>
      {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
    </div>
  );
}
