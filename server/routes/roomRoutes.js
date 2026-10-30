/*
 * Room Routes  (teacher-only CRUD)
 *
 * GET    /api/rooms       — list all rooms
 * POST   /api/rooms       — create a room
 * PUT    /api/rooms/:id   — update a room
 * DELETE /api/rooms/:id   — delete a room
 *
 * All routes require a valid JWT.
 * Write routes require the "teacher" role.
 *
 * These routes replace the localStorage getRooms/saveRooms pattern
 * in teacher.js while keeping the same room data shape.
 */

"use strict";

const express = require("express");
const Room    = require("../models/Room");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

const teacherOnly = [requireAuth, requireRole("teacher")];


/* -------------------------------------------------------
   Capacity helper  (mirrors getRoomCapacity in seating-algorithm.js)
   ------------------------------------------------------- */

function computeCapacity(type, rows, columns, benchesPerRow, studentsPerBench) {
  if (type === "standard") {
    return Number(rows) * Number(columns);
  }
  return Number(rows) * Number(benchesPerRow) * Number(studentsPerBench || 2);
}


/* -------------------------------------------------------
   GET /api/rooms
   ------------------------------------------------------- */

router.get("/", requireAuth, async function (req, res) {

  try {
    const rooms = await Room.find().sort({ name: 1 });
    return res.status(200).json({ rooms });
  } catch (error) {
    console.error("Get rooms error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   POST /api/rooms
   ------------------------------------------------------- */

router.post("/", ...teacherOnly, async function (req, res) {

  try {

    const {
      name, type, rows,
      columns, benchesPerRow, studentsPerBench
    } = req.body;

    if (!name || !type || !rows) {
      return res.status(400).json({ message: "name, type, and rows are required." });
    }

    if (type !== "standard" && type !== "bench") {
      return res.status(400).json({ message: "type must be 'standard' or 'bench'." });
    }

    const capacity = computeCapacity(type, rows, columns, benchesPerRow, studentsPerBench);

    const room = new Room({
      name, type, rows,
      columns:          columns          || 0,
      benchesPerRow:    benchesPerRow    || 0,
      studentsPerBench: studentsPerBench || 2,
      capacity
    });

    await room.save();

    return res.status(201).json({ room });

  } catch (error) {
    console.error("Create room error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   PUT /api/rooms/:id
   ------------------------------------------------------- */

router.put("/:id", ...teacherOnly, async function (req, res) {

  try {

    const {
      name, type, rows,
      columns, benchesPerRow, studentsPerBench
    } = req.body;

    const capacity = computeCapacity(type, rows, columns, benchesPerRow, studentsPerBench);

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      {
        name, type, rows,
        columns:          columns          || 0,
        benchesPerRow:    benchesPerRow    || 0,
        studentsPerBench: studentsPerBench || 2,
        capacity
      },
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    return res.status(200).json({ room });

  } catch (error) {
    console.error("Update room error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   DELETE /api/rooms/:id
   ------------------------------------------------------- */

router.delete("/:id", ...teacherOnly, async function (req, res) {

  try {

    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    return res.status(200).json({ message: "Room deleted." });

  } catch (error) {
    console.error("Delete room error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


module.exports = router;
