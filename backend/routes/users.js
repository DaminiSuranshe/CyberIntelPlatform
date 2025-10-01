const express = require("express");
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

// Only admins can manage users
router.get("/", auth, authorizeRoles("admin"), getUsers);
router.get("/:id", auth, authorizeRoles("admin"), getUser);
router.put("/:id", auth, authorizeRoles("admin"), updateUser);
router.delete("/:id", auth, authorizeRoles("admin"), deleteUser);

module.exports = router;
