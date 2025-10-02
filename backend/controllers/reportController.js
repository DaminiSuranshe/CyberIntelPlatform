const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const Risk = require("../models/Risk");
const Log = require("../models/Log");
const IoC = require("../models/IoC");
const Alert = require("../models/Alert");

/**
 * GET /api/reports/export?format=csv&type=risks
 * format: csv | pdf
 * type: risks | alerts | iocs | logs
 */
exports.exportReport = async (req, res) => {
  try {
    const fmt = (req.query.format || "csv").toLowerCase();
    const type = (req.query.type || "risks").toLowerCase();

    let data = [];
    if (type === "risks") {
      data = await Risk.find().populate("logId", "fileName").lean();
    } else if (type === "alerts") {
      data = await Alert.find().populate("logId", "fileName").populate("riskId").lean();
    } else if (type === "iocs") {
      data = await IoC.find().lean();
    } else if (type === "logs") {
      data = await Log.find().lean();
    } else return res.status(400).json({ msg: "Invalid type" });

    if (fmt === "csv") {
      const fields = Object.keys(data[0] || {});
      const parser = new Parser({ fields });
      const csv = parser.parse(data);
      res.header("Content-Type", "text/csv");
      res.attachment(`${type}-${Date.now()}.csv`);
      return res.send(csv);
    } else if (fmt === "pdf") {
      // Simple PDF listing
      const doc = new PDFDocument({ margin: 30, size: "A4" });
      res.setHeader("Content-disposition", `attachment; filename=${type}-${Date.now()}.pdf`);
      res.setHeader("Content-type", "application/pdf");
      doc.pipe(res);
      doc.fontSize(18).text(`${type.toUpperCase()} Report`, { align: "center" });
      doc.moveDown();
      data.forEach((row, idx) => {
        doc.fontSize(10).text(`${idx + 1}. ${JSON.stringify(row)}`);
        doc.moveDown(0.4);
      });
      doc.end();
    } else {
      return res.status(400).json({ msg: "Invalid format" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
