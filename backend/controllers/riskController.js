const Risk = require("../models/Risk");
const Log = require("../models/Log");
const Actor = require("../models/Actor");
const IoC = require("../models/IoC");

// Calculate risk for a single log
exports.calculateRisk = async (req, res) => {
  try {
    const log = await Log.findById(req.params.logId);
    if (!log) return res.status(404).json({ msg: "Log not found" });

    const matchedIoCs = log.matchedIoCs.map(m => m.ioc);
    
    // Fetch threat actors associated with matched IoCs
    const actors = await Actor.find({ associatedIoCs: { $in: matchedIoCs } });
    const threatActors = actors.map(a => a.name);

    // Calculate risk score
    let score = 0;
    matchedIoCs.forEach(async (iocValue) => {
      const ioc = await IoC.findOne({ value: iocValue });
      switch(ioc.threatLevel){
        case "low": score += 10; break;
        case "medium": score += 30; break;
        case "high": score += 60; break;
        case "critical": score += 100; break;
      }
    });

    // Convert score to risk level
    let riskLevel = "Low";
    if (score >= 60 && score < 120) riskLevel = "Medium";
    else if (score >= 120 && score < 200) riskLevel = "High";
    else if (score >= 200) riskLevel = "Critical";

    const newRisk = new Risk({
      logId: log._id,
      matchedIoCs,
      threatActors,
      calculatedScore: score,
      riskLevel
    });

    await newRisk.save();
    res.json(newRisk);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all risks
exports.getRisks = async (req, res) => {
  try {
    const risks = await Risk.find().populate("logId", "fileName");
    res.json(risks);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get single risk
exports.getRisk = async (req, res) => {
  try {
    const risk = await Risk.findById(req.params.id).populate("logId", "fileName");
    if (!risk) return res.status(404).json({ msg: "Risk not found" });
    res.json(risk);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
