/*
 * ExamSeat — Express Server Entry Point
 *
 * Connects to MongoDB, mounts all API routes, and serves the
 * existing static frontend files (index.html, teacher.html, etc.)
 * from the project root.
 *
 * Start with:  node server/index.js
 *   or via:    npm start
 */

"use strict";

const path    = require("path");
const express = require("express");
const cors    = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const app  = express();
const PORT = process.env.PORT || 3000;


/* =========================================================
   MIDDLEWARE
   ========================================================= */

/* Allow the frontend (same origin when served statically,
   or localhost:5500 if opened with Live Server) to call the API */
app.use(cors());

/* Parse JSON request bodies */
app.use(express.json());

/* Parse URL-encoded bodies (form submissions) */
app.use(express.urlencoded({ extended: true }));


/* =========================================================
   STATIC FILES
   Serve the existing frontend from the project root so that
   opening http://localhost:3000 shows index.html just like
   opening it directly in the browser did before.
   ========================================================= */

app.use(express.static(path.join(__dirname, "..")));


/* =========================================================
   API ROUTES
   ========================================================= */

const authRoutes        = require("./routes/authRoutes");
const studentRoutes     = require("./routes/studentRoutes");
const roomRoutes        = require("./routes/roomRoutes");
const examinationRoutes = require("./routes/examinationRoutes");
const seatingPlanRoutes = require("./routes/seatingPlanRoutes");

app.use("/api/auth",          authRoutes);
app.use("/api/students",      studentRoutes);
app.use("/api/rooms",         roomRoutes);
app.use("/api/examinations",  examinationRoutes);
app.use("/api/seating-plans", seatingPlanRoutes);


/* =========================================================
   CATCH-ALL — serve index.html for any non-API route
   (lets the frontend handle its own routing)
   ========================================================= */

app.get(/^(?!\/api).*/, function (req, res) {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});


/* =========================================================
   GLOBAL ERROR HANDLER
   ========================================================= */

app.use(function (err, req, res, _next) {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});


/* =========================================================
   CONNECT TO MONGODB, THEN START SERVER
   ========================================================= */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(function () {
    console.log("Connected to MongoDB:", process.env.MONGODB_URI);
    app.listen(PORT, function () {
      console.log(`ExamSeat server running at http://localhost:${PORT}`);
    });
  })
  .catch(function (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
