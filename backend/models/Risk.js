const mongoose = require("mongoose");

const riskSchema = new mongoose.Schema({
  logId: { type: mongoose.Schema.Types.ObjectId, ref: "Log", required: true },
  matchedIoCs: { type: [String], default: [] },
  threatActors: { type: [String], default: [] },
  riskLevel: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Low" },
  calculatedScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Risk", riskSchema);
