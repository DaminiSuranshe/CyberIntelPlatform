const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const { exportReport } = require("../controllers/reportController");

router.get("/export", auth, authorizeRoles("admin","analyst"), exportReport);

module.exports = router;
