const Alert = require("../models/Alert");
const Risk = require("../models/Risk");
const Log = require("../models/Log");

// Generate alert based on risk
exports.generateAlert = async (req, res) => {
  try {
    const risk = await Risk.findById(req.params.riskId);
    if (!risk) return res.status(404).json({ msg: "Risk not found" });

    const log = await Log.findById(risk.logId);

    const message = `Risk detected in log "${log.fileName}". Risk Level: ${risk.riskLevel}`;

    const alert = new Alert({
      logId: log._id,
      riskId: risk._id,
      message,
      severity: risk.riskLevel
    });

    await alert.save();
    res.json(alert);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all alerts
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().populate("logId", "fileName").populate("riskId", "calculatedScore riskLevel");
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Acknowledge alert
exports.acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { acknowledged: true }, { new: true });
    if (!alert) return res.status(404).json({ msg: "Alert not found" });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
