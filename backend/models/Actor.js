const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String },
  techniques: { type: [String], default: [] },
  associatedIoCs: { type: [String], default: [] }, // link IoC values
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Actor", actorSchema);
