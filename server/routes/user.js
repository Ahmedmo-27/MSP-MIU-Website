const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, getProfile, updateProfile, addScore } = require("../controllers/user");
const { authenticateToken, verifyRole } = require("../middlewares/auth");
const { upload } = require("../utils/upload");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateToken, logoutUser);

// Protected routes (require authentication)
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, upload.single('profile_picture'), updateProfile);

// Admin-only routes
router.post("/score", authenticateToken, verifyRole('admin'), addScore);

module.exports = router;

