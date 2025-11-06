import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function EmployeePortal() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/employee/payments");
        setItems(data.items || []);
      } catch (err) {
        setMsg(err?.response?.data?.message || "Failed to load payments");
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 16 }}>
      <h2>Recent Payments</h2>
      {msg && <p>{msg}</p>}
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Account</th>
            <th>Reference</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p._id}>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
              <td>{p.customer?.fullName}</td>
              <td>{p.customer?.accountNumber}</td>
              <td>{p.reference}</td>
              <td>{p.amount}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan="5">No payments yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
