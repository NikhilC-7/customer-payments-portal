// server/payments.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('./auth');

// list pending payments (employees and managers can view)
router.get('/pending', requireAuth, requireRole('employee','manager'), async (req, res) => {
  const { rows } = await pool.query('SELECT id, beneficiary_name, iban, amount, currency, reference FROM payments WHERE status=$1', ['pending']);
  res.json(rows);
});

// approve payment (only manager)
router.post('/:id/approve', requireAuth, requireRole('manager'), whitelist([{ name: 'id', pattern: /^[0-9]+$/ }]), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await pool.query('UPDATE payments SET status=$1, approved_by=$2, approved_at=now() WHERE id=$3', ['approved', req.user.userId, id]);
  res.json({ success: true });
});

// reject payment (manager or employee with audit)
router.post('/:id/reject', requireAuth, requireRole('manager'), whitelist([{ name: 'id', pattern: /^[0-9]+$/ }, { name: 'reason', pattern: /^[A-Za-z0-9 \-_,.]{1,250}$/ }]), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const reason = req.body.reason;
  await pool.query('UPDATE payments SET status=$1, rejection_reason=$2, rejected_by=$3, rejected_at=now() WHERE id=$4', ['rejected', reason, req.user.userId, id]);
  res.json({ success: true });
});

module.exports = router;
// ✅ Define whitelist RegEx patterns
const accountNumberPattern = /^[0-9]{10,12}$/;  // e.g., 10–12 digits only
const amountPattern = /^\d+(\.\d{1,2})?$/;      // numbers with up to 2 decimals
const currencyPattern = /^[A-Z]{3}$/;           // e.g., USD, ZAR, GBP
const descriptionPattern = /^[a-zA-Z0-9 ,.'-]{3,100}$/; // clean, human text

router.post("/create", (req, res) => {
  const { accountNumber, amount, currency, description } = req.body;

  // ✅ Apply whitelist checks
  if (!accountNumberPattern.test(accountNumber))
    return res.status(400).json({ message: "Invalid account number format." });

  if (!amountPattern.test(amount))
    return res.status(400).json({ message: "Invalid amount format." });

  if (!currencyPattern.test(currency))
    return res.status(400).json({ message: "Invalid currency code." });

  if (!descriptionPattern.test(description))
    return res.status(400).json({ message: "Invalid description." });

  // Continue with payment logic...
  res.json({ message: "✅ Payment created successfully." });
});

export default router;