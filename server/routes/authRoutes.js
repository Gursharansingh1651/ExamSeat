/*
 * Auth Routes
 *
 * POST /api/auth/signup  — create a new account (student or teacher)
 * POST /api/auth/login   — authenticate and receive a JWT
 * GET  /api/auth/me      — return the current user (requires JWT)
 *
 * This replaces the localStorage-based signup/login in auth.js.
 * Password hashing is handled by the Account model's pre-save hook (bcrypt).
 * On successful login a signed JWT is returned instead of writing to localStorage.
 */

"use strict";

const express = require("express");
const jwt     = require("jsonwebtoken");
const Account = require("../models/Account");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();


/* -------------------------------------------------------
   Helper — sign a JWT for an account document
   ------------------------------------------------------- */

function signToken(account) {
  return jwt.sign(
    {
      accountId:  account._id,
      name:       account.name,
      identifier: account.identifier,
      role:       account.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}


/* -------------------------------------------------------
   POST /api/auth/signup
   ------------------------------------------------------- */

router.post("/signup", async function (req, res) {

  try {

    const { name, identifier, password, role, teacherCode } = req.body;

    /* --- basic validation (mirrors auth.js frontend validation) --- */

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Please enter your full name." });
    }

    if (!identifier || !identifier.trim()) {
      return res.status(400).json({ message: "Please enter your Student ID or email." });
    }

    if (!password) {
      return res.status(400).json({ message: "Please create a password." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    if (role !== "student" && role !== "teacher") {
      return res.status(400).json({ message: "Please select an account type." });
    }

    /* --- teacher registration code check --- */

    if (role === "teacher") {
      const validCode = process.env.TEACHER_REGISTRATION_CODE || "EXAMSEAT-TEACHER";
      if (!teacherCode || teacherCode.trim() !== validCode) {
        return res.status(400).json({ message: "Invalid teacher registration code." });
      }
    }

    /* --- duplicate check (identifier is stored lowercase by schema) --- */

    const existing = await Account.findOne({ identifier: identifier.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with these credentials already exists." });
    }

    /* --- create account (password hashed by pre-save hook) --- */

    const account = new Account({
      name:       name.trim(),
      identifier: identifier.trim(),
      password:   password,
      role:       role
    });

    await account.save();

    /* --- respond without the password hash --- */

    return res.status(201).json({
      message: "Account created successfully. You can now sign in.",
      account: account.toJSON()
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error during signup." });
  }

});


/* -------------------------------------------------------
   POST /api/auth/login
   ------------------------------------------------------- */

router.post("/login", async function (req, res) {

  try {

    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required." });
    }

    /* Find by normalised identifier */
    const account = await Account.findOne({ identifier: identifier.trim().toLowerCase() });

    if (!account) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    /* bcrypt comparison */
    const passwordMatch = await account.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    /* Sign and return the JWT */
    const token = signToken(account);

    return res.status(200).json({
      token,
      account: account.toJSON()
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login." });
  }

});


/* -------------------------------------------------------
   GET /api/auth/me  (protected)
   ------------------------------------------------------- */

router.get("/me", requireAuth, async function (req, res) {

  try {

    const account = await Account.findById(req.user.accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }

    return res.status(200).json({ account: account.toJSON() });

  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ message: "Server error." });
  }

});


module.exports = router;
