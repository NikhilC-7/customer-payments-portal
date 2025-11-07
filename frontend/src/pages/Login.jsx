// src/pages/Login.jsx
import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    accountNumber: "",
    password: "",
    role: "customer",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (form.role === "employee") {
        // Static employee credentials
        const EMPLOYEE_USERNAME = "admin";
        const EMPLOYEE_PASSWORD = "secure123";

        if (
          form.accountNumber === EMPLOYEE_USERNAME &&
          form.password === EMPLOYEE_PASSWORD
        ) {
          localStorage.setItem("role", "employee");
          setMessage("✅ Employee login successful!");
          navigate("/employee");
        } else {
          setMessage("❌ Invalid employee credentials.");
        }
      } else {
        // Customer login through API
        const res = await api.post("/auth/login", {
          accountNumber: form.accountNumber,
          password: form.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "customer");
        setMessage("✅ Customer login successful!");
        navigate("/payment");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(
        err.response?.data?.message || "❌ Login failed. Please try again."
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="customer">Customer</option>
          <option value="employee">Employee</option>
        </select>

        <input
          name="accountNumber"
          placeholder={
            form.role === "employee" ? "Employee Username" : "Account Number"
          }
          value={form.accountNumber}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Login
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}

      {/* ---------------------------- */}
      {/* Register button for customers */}
      {/* ---------------------------- */}
      {form.role === "customer" && (
        <button
          onClick={() => navigate("/register")}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      )}
    </div>
  );
};

export default Login;
