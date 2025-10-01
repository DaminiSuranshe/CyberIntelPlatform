const express = require("express");
const router = express.Router();
const { createIoC, getIoCs, getIoC, updateIoC, deleteIoC } = require("../controllers/iocController");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

// Only admins & analysts can create/update/delete IoCs
router.post("/", auth, authorizeRoles("admin", "analyst"), createIoC);
router.get("/", auth, authorizeRoles("admin", "analyst", "viewer"), getIoCs);
router.get("/:id", auth, authorizeRoles("admin", "analyst", "viewer"), getIoC);
router.put("/:id", auth, authorizeRoles("admin", "analyst"), updateIoC);
router.delete("/:id", auth, authorizeRoles("admin", "analyst"), deleteIoC);

module.exports = router;
