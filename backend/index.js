const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/equipment", require("./routes/equipment"));
app.use("/api/workorders", require("./routes/workorders"));
app.use("/api/reports", require("./routes/reports"));

const PORT = process.env.PORT || 5001;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/equipment_maintenance";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
