const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const { uploadLog, getLogs, getLog } = require("../controllers/logController");

const upload = multer({ dest: "uploads/" });

// Upload log (admin & analyst)
router.post("/upload", auth, authorizeRoles("admin", "analyst"), upload.single("file"), uploadLog);

// Get all logs (all roles)
router.get("/", auth, authorizeRoles("admin", "analyst", "viewer"), getLogs);

// Get single log
router.get("/:id", auth, authorizeRoles("admin", "analyst", "viewer"), getLog);

module.exports = router;
