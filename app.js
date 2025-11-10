require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT;

const app = express();

app.use(cors());
// Use Express built-in JSON parser instead of body-parser (removes util._extend deprecation warning)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import API routes from server
const apiRoutes = require("./server/server");

// API routes
app.use("/api", apiRoutes);

// Serve uploaded files (profile pictures, etc.)
app.use("/uploads", express.static(path.join(__dirname, "server/uploads")));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "client/public")));

// Catch-all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/public/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
