const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const { generateAlert, getAlerts, acknowledgeAlert } = require("../controllers/alertController");

// Generate alert (admin/analyst)
router.post("/generate/:riskId", auth, authorizeRoles("admin", "analyst"), generateAlert);

// Get all alerts (all roles)
router.get("/", auth, authorizeRoles("admin", "analyst", "viewer"), getAlerts);

// Acknowledge alert (admin/analyst)
router.put("/acknowledge/:id", auth, authorizeRoles("admin", "analyst"), acknowledgeAlert);

module.exports = router;
