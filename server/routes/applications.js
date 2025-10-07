const express = require("express");
const { createApplication, getAllApplications, updateApplicationStatus, updateApplicationComment, deleteApplication } = require("../controllers/applications");

const router = express.Router();

// Routes
router.post("/", createApplication);
router.get("/", getAllApplications);
router.put("/:id/status", updateApplicationStatus);
router.put("/:id/comment", updateApplicationComment);
router.delete("/:id", deleteApplication);


module.exports = router;
