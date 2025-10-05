const express = require("express");
const { createApplication, getAllApplications, updateApplicationStatus, deleteApplication } = require("../controllers/applications");

const router = express.Router();

// Routes
router.post("/", createApplication);
router.get("/", getAllApplications);
router.put("/:id/status", updateApplicationStatus);
router.delete("/:id", deleteApplication);


module.exports = router;
