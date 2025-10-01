const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  logId: { type: mongoose.Schema.Types.ObjectId, ref: "Log", required: true },
  riskId: { type: mongoose.Schema.Types.ObjectId, ref: "Risk", required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Low" },
  acknowledged: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
