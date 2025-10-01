const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const { createActor, getActors, getActor, updateActor, deleteActor } = require("../controllers/actorController");
const { correlateThreats } = require("../controllers/correlationController");

// CRUD for actors (admin only)
router.post("/", auth, authorizeRoles("admin"), createActor);
router.get("/", auth, authorizeRoles("admin", "analyst", "viewer"), getActors);
router.get("/:id", auth, authorizeRoles("admin", "analyst", "viewer"), getActor);
router.put("/:id", auth, authorizeRoles("admin"), updateActor);
router.delete("/:id", auth, authorizeRoles("admin"), deleteActor);

// Correlate threats from logs
router.get("/correlate/logs", auth, authorizeRoles("admin", "analyst"), correlateThreats);

module.exports = router;
