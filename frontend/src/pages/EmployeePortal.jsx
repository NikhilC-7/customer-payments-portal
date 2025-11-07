import React, { useEffect, useState } from "react";
import api from "../api/api";

const EmployeePortal = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static employee key for dev/testing
  const EMPLOYEE_KEY = "valterra123";

  // ----------------------------
  // Fetch all payments
  // ----------------------------
  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments", {
        headers: { "x-employee-key": EMPLOYEE_KEY },
      });
      setPayments(res.data);
    } catch (err) {
      console.error("Fetch payments error:", err);
      alert(
        "Unable to fetch payments. Ensure the backend route '/api/payments' exists and the employee key is correct."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Approve a payment
  // ----------------------------
  const handleApprove = async (id) => {
    try {
      // ✅ Use POST to match backend route
      await api.post(`/payments/${id}/approve`, {}, {
        headers: { "x-employee-key": EMPLOYEE_KEY },
      });
      fetchPayments(); // refresh list
    } catch (err) {
      console.error("Approval error:", err);
      alert("Error approving payment.");
    }
  };

  // ----------------------------
  // Reject a payment
  // ----------------------------
  const handleReject = async (id) => {
    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;

    try {
      // ✅ Use POST to match backend route
      await api.post(`/payments/${id}/reject`, { reason }, {
        headers: { "x-employee-key": EMPLOYEE_KEY },
      });
      fetchPayments(); // refresh list
    } catch (err) {
      console.error("Rejection error:", err);
      alert("Error rejecting payment.");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <p>Loading payments...</p>;

  return (
    <div className="employee-portal" style={{ padding: "20px" }}>
      <h2>Employee Portal</h2>

      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", textAlign: "left", marginTop: "10px" }}
        >
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
                <td>{p.status || (p.verified ? "Approved" : "Pending")}</td>
                <td>{p.rejectionReason || "-"}</td>
                <td>
                  {p.status !== "approved" && (
                    <button
                      style={{ marginRight: "10px" }}
                      onClick={() => handleApprove(p._id)}
                    >
                      Approve
                    </button>
                  )}
                  {p.status !== "rejected" && (
                    <button
                      style={{ backgroundColor: "#ffcccc" }}
                      onClick={() => handleReject(p._id)}
                    >
                      Reject
                    </button>
                  )}
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
