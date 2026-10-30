/*
 * JWT Authentication Middleware
 *
 * Verifies the Bearer token sent in the Authorization header.
 * Attaches the decoded payload to req.user so route handlers
 * can read the accountId and role without re-querying the DB.
 *
 * Usage:
 *   router.get("/protected", requireAuth, (req, res) => { ... });
 *
 * Optional role guard:
 *   router.post("/teacher-only", requireAuth, requireRole("teacher"), ...);
 */

"use strict";

const jwt = require("jsonwebtoken");

/* -------------------------------------------------------
   requireAuth — verifies JWT, populates req.user
   ------------------------------------------------------- */

function requireAuth(req, res, next) {

  const authHeader = req.headers.authorization;

  /* Expect: "Bearer <token>" */
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;   /* { accountId, name, identifier, role, iat, exp } */
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

}


/* -------------------------------------------------------
   requireRole — role guard (use after requireAuth)
   ------------------------------------------------------- */

function requireRole(role) {
  return function (req, res, next) {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
}


module.exports = { requireAuth, requireRole };
