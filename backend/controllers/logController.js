const Log = require("../models/Log");
const IoC = require("../models/IoC");
const csv = require("csv-parser");
const fs = require("fs");

// Upload & process log
exports.uploadLog = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ msg: "No file uploaded" });

    let parsedData = [];

    // Determine file type
    if (file.mimetype === "application/json") {
      const raw = fs.readFileSync(file.path);
      parsedData = JSON.parse(raw);
    } else if (file.mimetype === "text/csv") {
      // Parse CSV
      const results = [];
      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          parsedData = results;
          await processLog(parsedData, file.originalname, req.user.id, res);
        });
      return; // CSV processed in stream callback
    }

    // For JSON files
    await processLog(parsedData, file.originalname, req.user.id, res);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Helper to process log & match IoCs
async function processLog(parsedData, fileName, userId, res) {
  try {
    const allIoCs = await IoC.find();
    const matchedIoCs = [];

    parsedData.forEach((entry) => {
      allIoCs.forEach((ioc) => {
        const values = Object.values(entry).map((v) => v.toString());
        if (values.includes(ioc.value)) {
          matchedIoCs.push({ ioc: ioc.value, type: ioc.type });
        }
      });
    });

    const newLog = new Log({
      fileName,
      uploadedBy: userId,
      parsedData,
      matchedIoCs,
    });

    await newLog.save();
    res.json({ msg: "Log uploaded & processed", log: newLog });
  } catch (err) {
    res.status(500).json({ msg: "Error processing log" });
  }
}

// Get all logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
}

// Get single log
exports.getLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) return res.status(404).json({ msg: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
}
