/*
 * Room model
 *
 * Mirrors the room shape used by teacher.js localStorage rooms.
 * Two room types are supported:
 *   "standard" — rows × columns grid
 *   "bench"    — rows × benches × positions
 *
 * Shape in localStorage (ST1):
 *   { id, name, type, rows, columns, benchesPerRow, studentsPerBench, capacity }
 */

"use strict";

const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true
    },

    type: {
      type:     String,
      required: true,
      enum:     ["standard", "bench"]
    },

    rows: {
      type:     Number,
      required: true,
      min:      1
    },

    /* Only relevant for type === "standard" */
    columns: {
      type:    Number,
      default: 0
    },

    /* Only relevant for type === "bench" */
    benchesPerRow: {
      type:    Number,
      default: 0
    },

    /* Only relevant for type === "bench" */
    studentsPerBench: {
      type:    Number,
      default: 2
    },

    /* Pre-computed capacity, stored for quick dashboard stats */
    capacity: {
      type:    Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Room", roomSchema);
