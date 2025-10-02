const Log = require('../models/Log');
const IoC = require('../models/IoC');
const Risk = require('../models/Risk');
const Alert = require('../models/Alert');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

exports.generateSummary = async (req, res) => {
  try {
    const logsCount = await Log.countDocuments();
    const iocsCount = await IoC.countDocuments();
    const risksCount = await Risk.countDocuments();
    const alertsCount = await Alert.countDocuments();

    const recentAlerts = await Alert.find().sort({ createdAt: -1 }).limit(5);

    res.json({ logs: logsCount, iocs: iocsCount, risks: risksCount, alerts: alertsCount, recentAlerts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error generating report' });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const risks = await Risk.find().populate('logId', 'fileName').lean();
    const rows = risks.map(r => ({ fileName: r.logId?.fileName || '', score: r.calculatedScore, riskLevel: r.riskLevel }));
    const fields = ['fileName', 'score', 'riskLevel'];
    const parser = new Parser({ fields });
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment('risk_report.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error exporting CSV' });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const summary = {
      logs: await Log.countDocuments(),
      iocs: await IoC.countDocuments(),
      risks: await Risk.countDocuments(),
      alerts: await Alert.countDocuments()
    };

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=summary_report.pdf');

    doc.fontSize(18).text('Cyber Intelligence Platform - Summary Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Logs: ${summary.logs}`);
    doc.text(`IOCs: ${summary.iocs}`);
    doc.text(`Risks: ${summary.risks}`);
    doc.text(`Alerts: ${summary.alerts}`);
    doc.end();

    doc.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error exporting PDF' });
  }
};
