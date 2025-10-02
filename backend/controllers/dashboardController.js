const IoC = require("../models/IoC");
const Log = require("../models/Log");
const Risk = require("../models/Risk");
const Alert = require("../models/Alert");
const Actor = require("../models/Actor");
const mongoose = require("mongoose");

/**
 * GET /api/dashboard/stats
 * Returns top-level counts and top IoCs, top actors
 */
exports.getOverview = async (req, res) => {
  try {
    const [iocCount, logCount, riskCount, alertCount] = await Promise.all([
      IoC.countDocuments(),
      Log.countDocuments(),
      Risk.countDocuments(),
      Alert.countDocuments()
    ]);

    // top 10 IoCs by frequency (sightings are stored as matched in logs)
    const topIoCsAgg = await Log.aggregate([
      { $unwind: "$matchedIoCs" },
      { $group: { _id: "$matchedIoCs.ioc", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { value: "$_id", count: 1, _id: 0 } }
    ]);

    // top actors by occurrence
    const topActorsAgg = await Log.aggregate([
      { $unwind: "$matchedIoCs" },
      { $lookup: {
          from: "actors",
          localField: "matchedIoCs.ioc",
          foreignField: "associatedIoCs",
          as: "actors"
      }},
      { $unwind: { path: "$actors", preserveNullAndEmptyArrays: false } },
      { $group: { _id: "$actors.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { name: "$_id", count: 1, _id: 0 } }
    ]);

    res.json({
      counts: { iocCount, logCount, riskCount, alertCount },
      topIoCs: topIoCsAgg,
      topActors: topActorsAgg
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * GET /api/dashboard/timeseries?days=30
 * Returns incidents per day for last N days (default 30)
 */
exports.getTimeSeries = async (req, res) => {
  try {
    const days = parseInt(req.query.days || "30", 10);
    const since = new Date(); since.setDate(since.getDate() - days);

    const agg = await Risk.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 },
          avgScore: { $avg: "$calculatedScore" }
      }},
      { $sort: { _id: 1 } }
    ]);

    // ensure days with zero are included
    const resultsMap = {};
    agg.forEach(r => resultsMap[r._id] = { count: r.count, avgScore: r.avgScore });

    // build array for each day
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0,10);
      out.push({
        date: key,
        count: resultsMap[key]?.count || 0,
        avgScore: resultsMap[key]?.avgScore || 0
      });
    }

    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
