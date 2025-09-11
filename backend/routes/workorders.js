const express = require("express");
const WorkOrder = require("../models/WorkOrder");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all work orders (with optional filters)
router.get("/", auth(), async (req, res) => {
  const { status, technician } = req.query;
  let filter = {};
  if (status) filter.status = status;
  if (technician) filter.assignedTechnician = technician;
  const workOrders = await WorkOrder.find(filter).populate(
    "equipment assignedTechnician"
  );
  res.json(workOrders);
});

// Create work order
router.post("/", auth(["Supervisor", "Manager"]), async (req, res) => {
  try {
    const wo = new WorkOrder(req.body);
    await wo.save();
    res.status(201).json(wo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update work order
router.put(
  "/:id",
  auth(["Supervisor", "Manager", "Technician"]),
  async (req, res) => {
    try {
      const wo = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!wo) return res.status(404).json({ message: "Not found" });
      res.json(wo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = router;
