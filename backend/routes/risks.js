const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const { calculateRisk, getRisks, getRisk } = require("../controllers/riskController");

// Calculate risk for a log (admin/analyst)
router.post("/calculate/:logId", auth, authorizeRoles("admin", "analyst"), calculateRisk);

// Get all risks (all roles)
router.get("/", auth, authorizeRoles("admin", "analyst", "viewer"), getRisks);

// Get single risk
router.get("/:id", auth, authorizeRoles("admin", "analyst", "viewer"), getRisk);

module.exports = router;
