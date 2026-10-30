/*
 * Student Routes  (teacher-only CRUD)
 *
 * GET    /api/students          — list all students
 * POST   /api/students          — create a student
 * PUT    /api/students/:id      — update a student
 * DELETE /api/students/:id      — delete a student
 * POST   /api/students/import   — bulk import from JSON array
 *
 * All routes require a valid JWT.
 * Write routes (POST/PUT/DELETE) additionally require the "teacher" role.
 *
 * These routes replace the localStorage getStudents/saveStudents pattern
 * in teacher.js while keeping the same data shape.
 */

"use strict";

const express = require("express");
const Student = require("../models/Student");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

const teacherOnly = [requireAuth, requireRole("teacher")];


/* -------------------------------------------------------
   GET /api/students
   ------------------------------------------------------- */

router.get("/", requireAuth, async function (req, res) {

  try {
    const students = await Student.find().sort({ name: 1 });
    return res.status(200).json({ students });
  } catch (error) {
    console.error("Get students error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   POST /api/students
   ------------------------------------------------------- */

router.post("/", ...teacherOnly, async function (req, res) {

  try {

    const { name, studentId, subject, section, course } = req.body;

    if (!name || !studentId || !subject || !section) {
      return res.status(400).json({ message: "name, studentId, subject, and section are required." });
    }

    const student = new Student({ name, studentId, subject, section, course: course || "" });
    await student.save();

    return res.status(201).json({ student });

  } catch (error) {
    console.error("Create student error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   PUT /api/students/:id
   ------------------------------------------------------- */

router.put("/:id", ...teacherOnly, async function (req, res) {

  try {

    const { name, studentId, subject, section, course } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, studentId, subject, section, course },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.status(200).json({ student });

  } catch (error) {
    console.error("Update student error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   DELETE /api/students/:id
   ------------------------------------------------------- */

router.delete("/:id", ...teacherOnly, async function (req, res) {

  try {

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.status(200).json({ message: "Student deleted." });

  } catch (error) {
    console.error("Delete student error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


/* -------------------------------------------------------
   POST /api/students/import
   Bulk-import an array of student objects (mirrors the JSON
   import feature in teacher.js FileReader handler).

   Accepted shape per record:
     { name, studentId | rollNo, subject, section, course? }
   ------------------------------------------------------- */

router.post("/import", ...teacherOnly, async function (req, res) {

  try {

    const records = req.body.students;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "Provide a non-empty students array." });
    }

    const errors   = [];
    const toInsert = [];

    records.forEach(function (record, index) {

      /* Support both "rollNo" and "studentId" field names (mirrors teacher.js import) */
      const studentId = record.studentId || record.rollNo;

      if (!record.name || !studentId || !record.subject || !record.section) {
        errors.push(`Record ${index + 1}: name, studentId/rollNo, subject, and section are required.`);
        return;
      }

      toInsert.push({
        name:      record.name,
        studentId: studentId,
        subject:   record.subject,
        section:   record.section,
        course:    record.course || ""
      });

    });

    if (errors.length > 0) {
      return res.status(400).json({ message: "Some records are invalid.", errors });
    }

    const inserted = await Student.insertMany(toInsert);

    return res.status(201).json({
      message:  `${inserted.length} student(s) imported.`,
      students: inserted
    });

  } catch (error) {
    console.error("Import students error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


module.exports = router;
