const express = require("express");
const PDFDocument = require("pdfkit");
const Equipment = require("../models/Equipment");
const WorkOrder = require("../models/WorkOrder");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Equipment Status Report
router.get(
  "/equipment-status",
  auth(["Manager", "Supervisor"]),
  async (req, res) => {
    const equipment = await Equipment.find();
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=equipment-status.pdf"
    );
    doc.pipe(res);
    doc.text("MechCorp Manufacturing\nEquipment Status Report\n\n");
    equipment.forEach((eq) => {
      doc.text(
        `${eq.name} (${eq.type}) - ${eq.status} | Last: ${
          eq.lastMaintenance ? eq.lastMaintenance.toDateString() : "N/A"
        } | Next: ${
          eq.nextMaintenance ? eq.nextMaintenance.toDateString() : "N/A"
        }`
      );
    });
    doc.end();
  }
);

// Work Order Summary Report
router.get(
  "/workorder-summary",
  auth(["Manager", "Supervisor"]),
  async (req, res) => {
    const { status, from, to } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (from || to) filter.createdDate = {};
    if (from) filter.createdDate.$gte = new Date(from);
    if (to) filter.createdDate.$lte = new Date(to);
    const workOrders = await WorkOrder.find(filter).populate(
      "equipment assignedTechnician"
    );
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=workorder-summary.pdf"
    );
    doc.pipe(res);
    doc.text("MechCorp Manufacturing\nWork Order Summary\n\n");
    workOrders.forEach((wo) => {
      doc.text(
        `${wo.title} | ${wo.status} | ${wo.equipment?.name || ""} | Assigned: ${
          wo.assignedTechnician?.name || "Unassigned"
        } | Due: ${wo.dueDate ? wo.dueDate.toDateString() : "N/A"}`
      );
    });
    doc.end();
  }
);

// Technician Workload Report
router.get(
  "/technician-workload",
  auth(["Manager", "Supervisor"]),
  async (req, res) => {
    const technicians = await User.find({ role: "Technician" });
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=technician-workload.pdf"
    );
    doc.pipe(res);
    doc.text("MechCorp Manufacturing\nTechnician Workload Report\n\n");
    for (const tech of technicians) {
      const count = await WorkOrder.countDocuments({
        assignedTechnician: tech._id,
        status: { $ne: "Completed" },
      });
      doc.text(`${tech.name} (${tech.email}) - Open Work Orders: ${count}`);
    }
    doc.end();
  }
);

module.exports = router;
