/*
 * Examination model
 *
 * Mirrors the examination shape used by teacher.js localStorage examinations.
 *
 * Shape in localStorage (ST1):
 *   { id, name, subject, date, startTime, duration, description,
 *     studentCount, studentIds[], roomIds[], roomCount, status }
 */

"use strict";

const mongoose = require("mongoose");

const examinationSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true
    },

    subject: {
      type:     String,
      required: true,
      trim:     true
    },

    /* ISO date string, e.g. "2026-11-15" */
    date: {
      type:     String,
      required: true
    },

    /* e.g. "09:00" */
    startTime: {
      type:     String,
      required: true
    },

    /* e.g. "2 hours" */
    duration: {
      type:     String,
      required: true
    },

    description: {
      type:    String,
      default: ""
    },

    /* References to assigned students */
    studentIds: {
      type:    [String],
      default: []
    },

    /* References to assigned rooms */
    roomIds: {
      type:    [String],
      default: []
    },

    /* "Upcoming" | "Ongoing" | "Completed" */
    status: {
      type:    String,
      default: "Upcoming"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Examination", examinationSchema);
