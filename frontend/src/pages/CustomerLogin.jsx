import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const CustomerLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ accountNumber: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.accountNumber || !form.password) {
      return setMessage("All fields are required");
    }

    try {
      const res = await api.post("/auth/login", form);

      // Store JWT token
      localStorage.setItem("token", res.data.token);

      // Update App state
      if (onLogin) onLogin(res.data.customer);

      // Redirect to payment page
      navigate("/customer/payment");
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div>
      <h2>Customer Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="accountNumber"
          placeholder="Account Number"
          value={form.accountNumber}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default CustomerLogin;
