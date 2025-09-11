const express = require("express");
const Equipment = require("../models/Equipment");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all equipment
router.get("/", auth(), async (req, res) => {
  const equipment = await Equipment.find();
  res.json(equipment);
});

// Add equipment (Supervisor/Manager only)
router.post("/", auth(["Supervisor", "Manager"]), async (req, res) => {
  try {
    const { name, type, status, lastMaintenance, nextMaintenance } = req.body;
    const eq = new Equipment({
      name,
      type,
      status,
      lastMaintenance,
      nextMaintenance,
    });
    await eq.save();
    res.status(201).json(eq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update equipment (Supervisor/Manager only)
router.put("/:id", auth(["Supervisor", "Manager"]), async (req, res) => {
  try {
    const eq = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!eq) return res.status(404).json({ message: "Not found" });
    res.json(eq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
