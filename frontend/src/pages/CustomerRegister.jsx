import React, { useState } from "react";
import api from "../api/api";
import { fullNamePattern, idNumberPattern, accountNumberPattern, passwordPattern } from "../utils/validators";
import { useNavigate } from "react-router-dom";

const CustomerRegister = () => {
  const [form, setForm] = useState({ fullName: "", idNumber: "", accountNumber: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ hook to navigate programmatically

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullNamePattern.test(form.fullName)) return setMessage("Invalid full name");
    if (!idNumberPattern.test(form.idNumber)) return setMessage("ID must be 13 digits");
    if (!accountNumberPattern.test(form.accountNumber)) return setMessage("Account number must be 10–12 digits");
    if (!passwordPattern.test(form.password)) return setMessage("Password must be 8+ chars with letters & numbers");

    try {
      const res = await api.post("/auth/register", form);
      setMessage(res.data.message); // show success message

      // Clear form
      setForm({ fullName: "", idNumber: "", accountNumber: "", password: "" });

      // Redirect to login page
      navigate("/customer/login");
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
    </div>
  );
};

export default CustomerRegister;
