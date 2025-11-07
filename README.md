Payments Portal

A simple web portal to view, approve, and reject payments. This system uses a static login and a static backend key to authenticate requests. No employee accounts or dynamic authentication are required.

---

Table of Contents

- Features
- Prerequisites
- Setup
  - Backend
  - Frontend
- Running the Application
- Testing the Portal
  - Employee Login
  - Viewing Payments
  - Approving Payments
  - Rejecting Payments
  - Customer Payments
- API Endpoints
- Troubleshooting
- Notes

---

Features

- Static password login for employees (secure123)
- Fetch all payments from backend (/api/payments)
- Approve or reject payments
- Reject with a reason prompt
- Static backend authentication key (valterra123)
- Customer portal allows making new payments and viewing their own payment status
- MongoDB Atlas used as database
- Frontend built with React, backend with Node.js and Express
- Fully frontend-only login, no employee accounts needed

---

Prerequisites

- Node.js >= 18
- npm
- MongoDB Atlas account
- Modern browser (Chrome, Firefox, Edge, etc.)

---

Setup

Backend

1. Navigate to the backend folder:

cd backend

2. Install dependencies:

npm install

3. Create account at mongo atlas database, Create your cluster and fetch your connection string

4. Create a .env file with the following values (update as needed):

PORT=5000
MONGO_URI=<Your MongoDB Atlas connection string> (Put in your own created password)
STATIC_KEY=valterra123

4. Start the backend server:

node server.js

The backend will run at http://localhost:5000.

Make sure your backend has the payments route:

// Example: backend/routes/payments.js
router.get("/payments", verifyStaticKey, async (req, res) => {
  const payments = await Payment.find();
  res.json(payments);
});

verifyStaticKey middleware checks for x-static-key: valterra123.

Frontend

1. Navigate to the frontend folder:

cd frontend

2. Install dependencies:

npm install

3. Start the frontend server:

npm run dev

4. Open the provided URL (usually http://localhost:5173) in your browser.

---

Running the Application

Employee Login

1. Open the frontend URL in your browser.
2. Enter the name & password: admin & secure123.
3. Click Login.
4. The employee portal displays all payments in a table.

Customer Payments

- Customers can access a separate frontend page (Customer Portal).
- Customers can create new payments by entering:
  - Amount
  - Currency
  - Provider
  - Payee Account
  - SWIFT code (optional)
- After submission, the payment is stored in MongoDB Atlas.
- Customers can view the status of their payments.
- Payment status updates automatically when employees approve or reject them.

---

Testing the Portal

Viewing Payments

- After login, the employee table lists all payments with columns:
  - Customer ID
  - Amount
  - Currency
  - Provider
  - Payee Account
  - SWIFT
  - Status
  - Actions

Approving Payments

- Click Approve next to a payment.
- Status updates via backend /payments/:id/approve endpoint.
- Table refreshes automatically.

Rejecting Payments

- Click Reject next to a payment.
- Enter a rejection reason in the prompt.
- Backend updates the payment status via /payments/:id/reject.
- Table refreshes automatically.

---

API Endpoints

Method   Endpoint                       Description
GET      /api/payments                  Fetch all payments (employee)
POST     /api/payments/:id/approve     Approve a payment (employee)
POST     /api/payments/:id/reject      Reject a payment (employee, body: { reason: "..." })
POST     /api/payments                  Create new payment (customer)

Headers for employee routes:

x-static-key: valterra123

---

Troubleshooting

- 404 errors when fetching payments
  - Ensure backend is running on http://localhost:5000.
  - Make sure the route /api/payments exists.
- CORS issues
  - Enable CORS in the backend with app.use(cors()).
- No payments displayed
  - Check if MongoDB Atlas has payment entries.
  - Verify x-static-key matches the backend key.

---



