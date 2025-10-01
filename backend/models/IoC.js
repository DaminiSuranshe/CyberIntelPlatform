const mongoose = require("mongoose");

const iocSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["ip", "domain", "url", "hash"], 
    required: true 
  },
  value: { type: String, required: true, unique: true },
  source: { type: String }, // e.g., VirusTotal, OTX
  threatLevel: { 
    type: String, 
    enum: ["low", "medium", "high", "critical"], 
    default: "low" 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("IoC", iocSchema);
