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
    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      if (onLogin) onLogin(res.data.customer);

      navigate("/customer/payment"); // redirect after login
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
        /><br/>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        /><br/>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default CustomerLogin;
