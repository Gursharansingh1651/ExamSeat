/*
 * Examination Routes  (teacher-only CRUD)
 *
 * GET    /api/examinations              — list all examinations
 * GET    /api/examinations/:id          — get a single examination
 * POST   /api/examinations              — create an examination
 * PUT    /api/examinations/:id          — update an examination
 * DELETE /api/examinations/:id          — delete an examination
 * PUT    /api/examinations/:id/students — assign student IDs to an exam
 * PUT    /api/examinations/:id/rooms    — assign room IDs to an exam
 *
 * GET requests require a valid JWT (both teacher and student can list exams).
 * Write requests require the "teacher" role.
 *
 * These routes replace the localStorage getExaminations/saveExaminations
 * pattern in teacher.js while keeping the same data shape.
 */

"use strict";

const express      = require("express");
const Examination  = require("../models/Examination");
const Room         = require("../models/Room");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

const teacherOnly = [requireAuth, requireRole("teacher")];


/* -------------------------------------------------------
   GET /api/examinations
   ------------------------------------------------------- */

router.get("/", requireAuth, async function (req, res) {

  try {
    const exams = await Examination.find().sort({ date: 1, startTime: 1 });
    return res.status(200).json({ examinations: exams });
  } catch (error) {
    console.error("Get examinations error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   GET /api/examinations/:id
   ------------------------------------------------------- */

router.get("/:id", requireAuth, async function (req, res) {

  try {
    const exam = await Examination.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Examination not found." });
    }
    return res.status(200).json({ examination: exam });
  } catch (error) {
    console.error("Get examination error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   POST /api/examinations
   ------------------------------------------------------- */

router.post("/", ...teacherOnly, async function (req, res) {

  try {

    const { name, subject, date, startTime, duration, description } = req.body;

    if (!name || !subject || !date || !startTime || !duration) {
      return res.status(400).json({
        message: "name, subject, date, startTime, and duration are required."
      });
    }

    const exam = new Examination({
      name, subject, date, startTime, duration,
      description: description || "",
      status: "Upcoming"
    });

    await exam.save();

    return res.status(201).json({ examination: exam });

  } catch (error) {
    console.error("Create examination error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   PUT /api/examinations/:id
   ------------------------------------------------------- */

router.put("/:id", ...teacherOnly, async function (req, res) {

  try {

    const { name, subject, date, startTime, duration, description, status } = req.body;

    const exam = await Examination.findByIdAndUpdate(
      req.params.id,
      { name, subject, date, startTime, duration, description, status },
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({ message: "Examination not found." });
    }

    return res.status(200).json({ examination: exam });

  } catch (error) {
    console.error("Update examination error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   DELETE /api/examinations/:id
   ------------------------------------------------------- */

router.delete("/:id", ...teacherOnly, async function (req, res) {

  try {

    const exam = await Examination.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: "Examination not found." });
    }

    return res.status(200).json({ message: "Examination deleted." });

  } catch (error) {
    console.error("Delete examination error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   PUT /api/examinations/:id/students
   Assign a list of student IDs to an exam.
   Body: { studentIds: ["id1", "id2", ...] }

   Mirrors openExaminationStudentWorkspace save in teacher.js.
   ------------------------------------------------------- */

router.put("/:id/students", ...teacherOnly, async function (req, res) {

  try {

    const { studentIds } = req.body;

    if (!Array.isArray(studentIds)) {
      return res.status(400).json({ message: "studentIds must be an array." });
    }

    const exam = await Examination.findByIdAndUpdate(
      req.params.id,
      {
        studentIds:   studentIds,
        studentCount: studentIds.length
      },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({ message: "Examination not found." });
    }

    return res.status(200).json({ examination: exam });

  } catch (error) {
    console.error("Assign students error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   PUT /api/examinations/:id/rooms
   Assign a list of room IDs to an exam.
   Body: { roomIds: ["id1", "id2", ...] }

   Also performs the room time-conflict check that mirrors
   findRoomTimeConflicts() in teacher.js.
   ------------------------------------------------------- */

router.put("/:id/rooms", ...teacherOnly, async function (req, res) {

  try {

    const { roomIds } = req.body;

    if (!Array.isArray(roomIds)) {
      return res.status(400).json({ message: "roomIds must be an array." });
    }

    /* --- load the exam being updated --- */
    const exam = await Examination.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Examination not found." });
    }

    /* --- room time-conflict check (mirrors findRoomTimeConflicts in teacher.js) --- */

    const durationMatch = String(exam.duration).match(/(\d+(?:\.\d+)?)/);
    const durationHours = durationMatch ? parseFloat(durationMatch[1]) : 0;
    const examStart     = new Date(`${exam.date}T${exam.startTime}`);
    const examEnd       = new Date(examStart.getTime() + durationHours * 3600 * 1000);

    if (!isNaN(examStart.getTime()) && durationHours > 0) {

      /* Find all other exams that share any of the requested rooms */
      const overlappingExams = await Examination.find({
        _id:     { $ne: exam._id },
        roomIds: { $in: roomIds }
      });

      const conflicts = [];

      overlappingExams.forEach(function (other) {

        const otherDurationMatch = String(other.duration).match(/(\d+(?:\.\d+)?)/);
        const otherDurationHours = otherDurationMatch ? parseFloat(otherDurationMatch[1]) : 0;
        const otherStart         = new Date(`${other.date}T${other.startTime}`);
        const otherEnd           = new Date(otherStart.getTime() + otherDurationHours * 3600 * 1000);

        if (isNaN(otherStart.getTime())) return;

        /* Check overlap: A and B overlap when A.start < B.end && A.end > B.start */
        const overlaps = examStart < otherEnd && examEnd > otherStart;
        if (!overlaps) return;

        /* Find which rooms are in conflict */
        roomIds.forEach(function (roomId) {
          if (other.roomIds.includes(roomId)) {
            conflicts.push({
              roomId:    roomId,
              examId:    other._id,
              examName:  other.name
            });
          }
        });

      });

      if (conflicts.length > 0) {
        return res.status(409).json({
          message: "One or more rooms have a time conflict with another examination.",
          conflicts
        });
      }

    }

    /* --- save --- */

    const updated = await Examination.findByIdAndUpdate(
      req.params.id,
      {
        roomIds:   roomIds,
        roomCount: roomIds.length
      },
      { new: true }
    );

    return res.status(200).json({ examination: updated });

  } catch (error) {
    console.error("Assign rooms error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


module.exports = router;
