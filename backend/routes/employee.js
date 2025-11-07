import express from "express";
const router = express.Router();

// GET /api/employee/payments
router.get("/payments", (req, res) => {
  // logic to fetch employee payments
  res.json([]); // replace with real data
});

// POST /api/employee/payments/:id/approve
router.post("/payments/:id/approve", (req, res) => {
  // logic to approve payment
  res.json({ message: "Approved" });
});

// POST /api/employee/payments/:id/reject
router.post("/payments/:id/reject", (req, res) => {
  // logic to reject payment
  res.json({ message: "Rejected" });
});

export default router;
