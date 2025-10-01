const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  parsedData: { type: Array, default: [] },    // structured log entries
  matchedIoCs: { type: Array, default: [] },   // IoC matches
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);
