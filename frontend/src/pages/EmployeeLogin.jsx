import React, { useState } from "react";
import api, { setAuthToken } from "../api/api";

const EmployeeLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/employee/auth/login", form);
      setAuthToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      onLogin(res.data.employee);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Employee Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required /><br/>
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br/>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default EmployeeLogin;
