const express = require("express");
const router = express.Router();
const { login, register, logout } = require("../controllers/auth");
const { authenticateToken } = require("../middlewares/auth");

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected routes (require authentication)
router.post("/logout", authenticateToken, logout);

module.exports = router;

