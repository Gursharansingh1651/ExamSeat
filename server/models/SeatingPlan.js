/*
 * SeatingPlan model
 *
 * Mirrors the seating plan shape returned by ExamSeatSeatingAlgorithm.createPlan().
 *
 * Shape in localStorage (ST1):
 *   {
 *     id, examId, status, generatedAt, studentCount, capacity,
 *     constraints: { avoidSameSectionAdjacency, avoidSameSubjectAdjacency },
 *     rooms: [{ roomId, roomName, type, rows, columns, benchesPerRow,
 *               studentsPerBench, capacity, assignments[] }],
 *     assignments: [{ roomId, seat, studentId, studentName, studentNumber,
 *                     subject, roomName, row, column?, bench?, position? }],
 *     unassignedStudentIds: []
 *   }
 *
 * We store the entire plan as a rich subdocument since the algorithm already
 * produces it in the correct shape. The flat assignments[] is what the student
 * portal queries to find a seat.
 */

"use strict";

const mongoose = require("mongoose");

/* --- individual seat assignment --- */
const assignmentSchema = new mongoose.Schema(
  {
    roomId:        String,
    roomName:      String,
    seat:          String,
    studentId:     String,
    studentName:   String,
    studentNumber: String,
    subject:       String,
    row:           Number,
    column:        Number,
    bench:         Number,
    position:      Number
  },
  { _id: false }
);

/* --- per-room sub-plan --- */
const roomPlanSchema = new mongoose.Schema(
  {
    roomId:          String,
    roomName:        String,
    type:            String,
    rows:            Number,
    columns:         Number,
    benchesPerRow:   Number,
    studentsPerBench: Number,
    capacity:        Number,
    assignments:     [assignmentSchema]
  },
  { _id: false }
);

const seatingPlanSchema = new mongoose.Schema(
  {
    /*
     * examId stores the MongoDB _id of the Examination as a string.
     * Using String (not ObjectId ref) keeps it consistent with
     * the frontend, which passes it as a plain string ID.
     */
    examId: {
      type:     String,
      required: true
    },

    /* "Generated" | "Finalized" */
    status: {
      type:    String,
      default: "Generated"
    },

    generatedAt: {
      type:    String,
      default: () => new Date().toISOString()
    },

    studentCount: Number,
    capacity:     Number,

    constraints: {
      avoidSameSectionAdjacency:  { type: Boolean, default: true },
      avoidSameSubjectAdjacency:  { type: Boolean, default: true }
    },

    rooms:                [roomPlanSchema],
    assignments:          [assignmentSchema],
    unassignedStudentIds: { type: [String], default: [] }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("SeatingPlan", seatingPlanSchema);
