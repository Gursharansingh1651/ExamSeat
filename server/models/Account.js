/*
 * Account model
 *
 * Mirrors the account shape used by auth.js localStorage accounts.
 * Passwords are stored as bcrypt hashes (NOT plaintext like in ST1).
 *
 * Shape in localStorage (ST1):
 *   { id, name, identifier, role, password, createdAt }
 *
 * Shape here:
 *   Same fields, but _id replaces id, and password is hashed.
 */

"use strict";

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const accountSchema = new mongoose.Schema(
  {
    /* Human-readable display name */
    name: {
      type:     String,
      required: true,
      trim:     true
    },

    /*
     * Student ID or email — used as the login identifier.
     * Stored lowercase so lookups are case-insensitive.
     */
    identifier: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
      lowercase: true
    },

    /* bcrypt hash of the plaintext password */
    password: {
      type:     String,
      required: true
    },

    role: {
      type:     String,
      required: true,
      enum:     ["student", "teacher"]
    }
  },
  {
    /* Adds createdAt and updatedAt automatically */
    timestamps: true
  }
);


/* -------------------------------------------------------
   PRE-SAVE HOOK — hash password before saving
   ------------------------------------------------------- */

accountSchema.pre("save", async function (next) {

  /*
   * Only hash if the password field was modified.
   * This prevents re-hashing on unrelated updates.
   */
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt     = await bcrypt.genSalt(10);
    this.password  = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }

});


/* -------------------------------------------------------
   INSTANCE METHOD — compare a plaintext password with the hash
   ------------------------------------------------------- */

accountSchema.methods.comparePassword = async function (plaintext) {
  return bcrypt.compare(plaintext, this.password);
};


/* -------------------------------------------------------
   Prevent the password hash from being sent in responses
   ------------------------------------------------------- */

accountSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};


module.exports = mongoose.model("Account", accountSchema);
