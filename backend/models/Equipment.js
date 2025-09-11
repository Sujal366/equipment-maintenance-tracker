const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ["Operational", "Under Maintenance", "Out of Service"],
      default: "Operational",
    },
    lastMaintenance: { type: Date },
    nextMaintenance: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", equipmentSchema);
