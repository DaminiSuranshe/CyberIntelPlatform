const mongoose = require('mongoose');

const IoCSchema = new mongoose.Schema({
  value: { type: String, required: true },
  type: { type: String, enum: ['ip','domain','url','hash'], required: true },
  description: { type: String },
  enrichedData: { type: Object }, // stores VirusTotal JSON data
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IoC', IoCSchema);
