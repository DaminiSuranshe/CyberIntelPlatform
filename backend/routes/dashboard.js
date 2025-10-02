const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const { getOverview, getTimeSeries } = require("../controllers/dashboardController");

router.get("/stats", auth, authorizeRoles("admin","analyst","viewer"), getOverview);
router.get("/timeseries", auth, authorizeRoles("admin","analyst","viewer"), getTimeSeries);

module.exports = router;
