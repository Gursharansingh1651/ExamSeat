/*
 * Student model
 *
 * Mirrors the student shape used by teacher.js localStorage students.
 *
 * Shape in localStorage (ST1):
 *   { id, name, studentId, subject, section, course }
 */

"use strict";

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    /* Display name */
    name: {
      type:     String,
      required: true,
      trim:     true
    },

    /*
     * Roll number / student ID.
     * Used by the student portal to find their seat.
     */
    studentId: {
      type:     String,
      required: true,
      trim:     true
    },

    subject: {
      type:     String,
      required: true,
      trim:     true
    },

    section: {
      type:     String,
      required: true,
      trim:     true
    },

    course: {
      type:  String,
      trim:  true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Student", studentSchema);
