const IoC = require("../models/IoC");

// Create new IoC
exports.createIoC = async (req, res) => {
  try {
    const { type, value, source, threatLevel } = req.body;

    // Check if IoC already exists
    const existing = await IoC.findOne({ value });
    if (existing) return res.status(400).json({ msg: "IoC already exists" });

    const newIoC = new IoC({ type, value, source, threatLevel });
    await newIoC.save();

    res.json(newIoC);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all IoCs
exports.getIoCs = async (req, res) => {
  try {
    const iocs = await IoC.find();
    res.json(iocs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get single IoC
exports.getIoC = async (req, res) => {
  try {
    const ioc = await IoC.findById(req.params.id);
    if (!ioc) return res.status(404).json({ msg: "IoC not found" });
    res.json(ioc);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update IoC
exports.updateIoC = async (req, res) => {
  try {
    const { type, value, source, threatLevel } = req.body;

    const updated = await IoC.findByIdAndUpdate(
      req.params.id,
      { type, value, source, threatLevel },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "IoC not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete IoC
exports.deleteIoC = async (req, res) => {
  try {
    const deleted = await IoC.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "IoC not found" });
    res.json({ msg: "IoC deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
