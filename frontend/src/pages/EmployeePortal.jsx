import React, { useEffect, useState } from "react";
import api from "../api/api";

const EmployeePortal = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments");
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const verifyPayment = async (id) => {
    try {
      await api.patch(`/payments/${id}/verify`);
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  return (
    <div>
      <h2>Employee Portal</h2>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Provider</th>
            <th>Payee Account</th>
            <th>SWIFT</th>
            <th>Verified</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p._id}>
              <td>{p.customerId}</td>
              <td>{p.amount}</td>
              <td>{p.currency}</td>
              <td>{p.provider}</td>
              <td>{p.payeeAccount}</td>
              <td>{p.swiftCode}</td>
              <td>{p.verified ? "Yes" : "No"}</td>
              <td>
                {!p.verified && <button onClick={() => verifyPayment(p._id)}>Verify</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeePortal;
