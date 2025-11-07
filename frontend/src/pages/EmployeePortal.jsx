// EmployeePortal.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";

const EmployeePortal = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const EMPLOYEE_KEY = "valterra123";

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments", {
        headers: { "x-employee-key": EMPLOYEE_KEY },
      });
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      alert("Unable to fetch payments. Check backend and employee key.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/payments/${id}/approve`, {}, {
        headers: { "x-employee-key": EMPLOYEE_KEY },
      });
      fetchPayments();
    } catch (err) {
      console.error("Approval error:", err);
      alert("Error approving payment");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await api.post(`/payments/${id}/reject`, { reason }, {
        headers: { "x-employee-key": EMPLOYEE_KEY },
      });
      fetchPayments();
    } catch (err) {
      console.error("Rejection error:", err);
      alert("Error rejecting payment");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <p>Loading payments...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Employee Portal</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Payee Account</th>
              <th>SWIFT</th>
              <th>Status</th>
              <th>Rejection Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td>{p.createdBy}</td>
                <td>{p.amount}</td>
                <td>{p.currency}</td>
                <td>{p.provider}</td>
                <td>{p.payeeAccount}</td>
                <td>{p.swiftCode || "N/A"}</td>
                <td>{p.status || "Pending"}</td>
                <td>{p.rejectionReason || "-"}</td>
                <td>
                  {p.status === "pending" && (
                    <>
                      <button onClick={() => handleApprove(p._id)}>Approve</button>
                      <button style={{ backgroundColor: "#ffcccc" }} onClick={() => handleReject(p._id)}>Reject</button>
                    </>
                  )}
                  {p.status === "approved" && <span>✅ Approved</span>}
                  {p.status === "rejected" && <span>❌ Rejected</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeePortal;
