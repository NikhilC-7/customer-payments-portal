// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CustomerPayment from "./pages/CustomerPayment";
import EmployeePortal from "./pages/EmployeePortal";
import Login from "./pages/Login";
import CustomerRegister from "./pages/CustomerRegister"; // ✅ Import register page
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CustomerRegister />} /> {/* ✅ Register route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Customer payment route */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute role="customer">
              <CustomerPayment />
            </ProtectedRoute>
          }
        />

        {/* Employee portal route */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute role="employee">
              <EmployeePortal />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/unauthorized" />} />
      </Routes>
    </Router>
  );
}

export default App;
