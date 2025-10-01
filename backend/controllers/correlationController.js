const Log = require("../models/Log");
const Actor = require("../models/Actor");

// Correlate logs with threat actors
exports.correlateThreats = async (req, res) => {
  try {
    const logs = await Log.find({}); // all logs
    const actors = await Actor.find({});

    const correlationResults = logs.map((log) => {
      const matchedActors = [];

      log.matchedIoCs.forEach((match) => {
        actors.forEach((actor) => {
          if (actor.associatedIoCs.includes(match.ioc) && !matchedActors.includes(actor.name)) {
            matchedActors.push(actor.name);
          }
        });
      });

      return {
        logId: log._id,
        fileName: log.fileName,
        matchedActors,
      };
    });

    res.json({ correlationResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
