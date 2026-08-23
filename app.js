"use strict";

// Role selection only. Each role owns its own document and controller.
document.querySelectorAll(".role-card").forEach((link) => link.addEventListener("click", () => {
  localStorage.setItem("examSeatRole", link.classList.contains("role-card--student") ? "student" : "teacher");
}));
