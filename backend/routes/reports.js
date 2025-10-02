const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const { generateSummary, exportCSV, exportPDF } = require("../controllers/reportController");

// Summary
router.get("/summary", auth, authorizeRoles("admin", "analyst", "viewer"), generateSummary);

// CSV export
router.get("/export/csv", auth, authorizeRoles("admin", "analyst"), exportCSV);

// PDF export
router.get("/export/pdf", auth, authorizeRoles("admin", "analyst"), exportPDF);

module.exports = router;
