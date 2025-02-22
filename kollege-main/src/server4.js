// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/q1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define the schema and model for cheating records
const cheatingRecordSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  branch: { type: String, required: true },
  department: { type: String, required: true },
}, { timestamps: true });

const CheatingRecord = mongoose.model("CheatingRecord", cheatingRecordSchema);

// GET route to fetch cheating records (sorted by newest first)
app.get("/cheating-records", async (req, res) => {
  try {
    const records = await CheatingRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route to add a new cheating record
app.post("/cheating-records", async (req, res) => {
  const { studentName, branch, department } = req.body;
  if (!studentName || !branch || !department) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newRecord = new CheatingRecord({ studentName, branch, department });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
