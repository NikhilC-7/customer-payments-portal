import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import CustomerLogin from "./pages/CustomerLogin";
import CustomerPayment from "./pages/CustomerPayment";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeePortal from "./pages/EmployeePortal";
import { setAuthToken } from "./api/api";

function Protected({ allowed, redirectTo, children }) {
  return allowed ? children : <Navigate to={redirectTo} replace />;
}

export default function App() {
  const [isCustomerAuthed, setIsCustomerAuthed] = useState(false);
  const [isEmployeeAuthed, setIsEmployeeAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
  }, []);

  const logout = () => {
    setAuthToken(null);
    setIsCustomerAuthed(false);
    setIsEmployeeAuthed(false);
  };

  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
        <Link to="/customer/login">Customer Login</Link>
        <Link to="/customer/payment">Make Payment</Link>
        <Link to="/employee/login">Employee Login</Link>
        <Link to="/employee/portal">Employee Portal</Link>
        <button onClick={logout} style={{ marginLeft: "auto" }}>Logout</button>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/customer/login" replace />} />

        <Route
          path="/customer/login"
          element={<CustomerLogin onLogin={() => setIsCustomerAuthed(true)} />}
        />
        <Route
          path="/customer/payment"
          element={
            <Protected allowed={!!localStorage.getItem("token") && isCustomerAuthed} redirectTo="/customer/login">
              <CustomerPayment />
            </Protected>
          }
        />

        <Route
          path="/employee/login"
          element={<EmployeeLogin onLogin={() => setIsEmployeeAuthed(true)} />}
        />
        <Route
          path="/employee/portal"
          element={
            <Protected allowed={!!localStorage.getItem("token") && isEmployeeAuthed} redirectTo="/employee/login">
              <EmployeePortal />
            </Protected>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
