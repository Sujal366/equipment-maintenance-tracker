const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "https://equipment-maintenance-tracker.sujalgandhi.me",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/equipment", require("./routes/equipment"));
app.use("/api/workorders", require("./routes/workorders"));
app.use("/api/reports", require("./routes/reports"));

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
