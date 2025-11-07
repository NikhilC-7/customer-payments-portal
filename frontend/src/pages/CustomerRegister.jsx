import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const CustomerRegister = () => {
  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ----------------------------
  // Validation regex patterns
  // ----------------------------
  const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
  const accountNumberPattern = /^[0-9]{10,12}$/;
  const idNumberPattern = /^[0-9]{13}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // ----------------------------
    // Frontend validation
    // ----------------------------
    if (!passwordPattern.test(form.password)) {
      setMessage(
        "Password must be 8+ characters, include a number and a special character."
      );
      return;
    }

    if (!accountNumberPattern.test(form.accountNumber)) {
      setMessage("Account number must be 10-12 digits.");
      return;
    }

    if (!idNumberPattern.test(form.idNumber)) {
      setMessage("ID number must be exactly 13 digits.");
      return;
    }

    try {
      const res = await api.post("/auth/register", form);
      setMessage(res.data.message);

      // Clear form
      setForm({ fullName: "", idNumber: "", accountNumber: "", password: "" });

      // Redirect to login after successful registration
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Customer Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          name="idNumber"
          placeholder="ID Number"
          value={form.idNumber}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          name="accountNumber"
          placeholder="Account Number"
          value={form.accountNumber}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        >
          Register
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}

      <button
        onClick={() => navigate("/login")}
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      >
        Go to Login
      </button>
    </div>
  );
};

export default CustomerRegister;
