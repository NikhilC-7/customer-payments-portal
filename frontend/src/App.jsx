import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import CustomerRegister from "./pages/CustomerRegister";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerPayment from "./pages/CustomerPayment";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeePortal from "./pages/EmployeePortal";

const App = () => {
  const [customer, setCustomer] = useState(null);
  const [employee, setEmployee] = useState(null);

  // Try to load JWT from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // You could decode JWT and set user type if you want
      // For simplicity, we'll keep previous session
    }
  }, []);

  return (
    <Router>
      <Routes>

        {/* -------- Customer Routes -------- */}
       <Route
  path="/customer/register"
  element={<CustomerRegister onRegister={setCustomer} />}
/>

        <Route
          path="/customer/login"
          element={<CustomerLogin onLogin={setCustomer} />}
        />
        <Route
          path="/customer/payment"
          element={
            customer ? <CustomerPayment /> : <Navigate to="/customer/login" />
          }
        />

        {/* -------- Employee Routes -------- */}
        <Route
          path="/employee/login"
          element={<EmployeeLogin onLogin={setEmployee} />}
        />
        <Route
          path="/employee/portal"
          element={
            employee ? <EmployeePortal /> : <Navigate to="/employee/login" />
          }
        />

        {/* -------- Default Route -------- */}
        <Route path="/" element={<Navigate to="/customer/login" />} />

      </Routes>
    </Router>
  );
};

export default App;
