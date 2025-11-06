import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const CustomerRegister = () => {
  const [form, setForm] = useState({ fullName: "", idNumber: "", accountNumber: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      setMessage(res.data.message);

      setForm({ fullName: "", idNumber: "", accountNumber: "", password: "" });

      // Optional automatic redirect after registration
      // navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div>
      <h2>Customer Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required /><br/>
        <input name="idNumber" placeholder="ID Number" value={form.idNumber} onChange={handleChange} required /><br/>
        <input name="accountNumber" placeholder="Account Number" value={form.accountNumber} onChange={handleChange} required /><br/>
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br/>
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>

      {/* Add manual "Go to Login" button */}
      <button onClick={() => navigate("/login")}>Go to Login</button>
    </div>
  );
};

export default CustomerRegister;
