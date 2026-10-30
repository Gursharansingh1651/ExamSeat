"use strict";

/* =========================================================
   STUDENT PORTAL
   Upgraded from localStorage to API calls.
   All original UI logic, layout, and seat-map rendering preserved.
   ========================================================= */

const studentViews = document.querySelectorAll(".student-view");
const studentLinks = document.querySelectorAll("[data-view]");
const seatFinder   = document.getElementById("seatFinder");
const formMessage  = document.getElementById("formMessage");
const seatResult   = document.getElementById("seatResult");
const studentExam  = document.getElementById("studentExam");

let activeSeatRecord = null;


/* =========================================================
   API HELPERS
   ========================================================= */

function getToken() {
  return localStorage.getItem("examSeatToken") || "";
}

function authHeaders() {
  return {
    "Content-Type":  "application/json",
    "Authorization": `Bearer ${getToken()}`
  };
}

async function apiGet(path) {
  const response = await fetch(path, { headers: authHeaders() });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `GET ${path} failed`);
  }
  return response.json();
}

/* Bridge _id → id so existing code can use .id everywhere */
function normaliseId(obj) {
  if (!obj) return obj;
  if (!obj.id && obj._id) return { ...obj, id: String(obj._id) };
  return obj;
}


/* =========================================================
   IN-MEMORY DATA
   ========================================================= */

let _examinations = [];
let _students     = [];
let _seatingPlans = [];


/* =========================================================
   LOADERS
   ========================================================= */

async function loadAll() {
  const [examData, studentData, planData] = await Promise.all([
    apiGet("/api/examinations"),
    apiGet("/api/students"),
    apiGet("/api/seating-plans")
  ]);

  _examinations = Array.isArray(examData.examinations)
    ? examData.examinations.map(normaliseId)
    : [];

  _students = Array.isArray(studentData.students)
    ? studentData.students.map(normaliseId)
    : [];

  _seatingPlans = Array.isArray(planData.seatingPlans)
    ? planData.seatingPlans.map(normaliseId)
    : [];
}


/* =========================================================
   ACCESSORS  (same signatures as the old localStorage helpers)
   ========================================================= */

function getExaminations()  { return _examinations; }
function getStudents()      { return _students;     }
function getSeatingPlans()  { return _seatingPlans; }


/* =========================================================
   FINALIZED EXAMINATIONS
   Only exams with a finalized seating plan appear in the dropdown.
   ========================================================= */

function getFinalizedExaminations() {

  return getExaminations().filter((exam) => {
    const plan = getSeatingPlans().find(
      (item) => item.examId === exam.id
    );
    return Boolean(plan && plan.status === "Finalized");
  });
}


/* =========================================================
   POPULATE EXAMINATION DROPDOWN
   ========================================================= */

function populateExamSelect() {

  if (!studentExam) return;

  const currentValue = studentExam.value;
  const examinations = getFinalizedExaminations();

  studentExam.innerHTML =
    `<option value="">Select your examination</option>`;

  examinations.forEach((exam) => {
    const option       = document.createElement("option");
    option.value       = exam.id;
    option.textContent = `${exam.name} · ${exam.subject}`;
    studentExam.appendChild(option);
  });

  if (examinations.some((e) => e.id === currentValue)) {
    studentExam.value = currentValue;
  }
}


/* =========================================================
   NORMALISE INPUT
   ========================================================= */

function normalise(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


/* =========================================================
   VIEW SWITCHING
   ========================================================= */

function showStudentView(viewId, updateHash = true) {

  const requestedView = document.getElementById(viewId);
  const view =
    requestedView &&
    (requestedView.id !== "seat-visualisation" || activeSeatRecord)
      ? requestedView
      : document.getElementById("home");

  studentViews.forEach((item) => {
    const active = item === view;
    item.hidden = !active;
    item.classList.toggle("active", active);
  });

  studentLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.view === view.id);
  });

  if (updateHash) history.pushState({ view: view.id }, "", `#${view.id}`);
}


/* =========================================================
   SEAT MAP RENDER  (unchanged from ST1)
   ========================================================= */

function renderSeatMap(record) {

  const seatMap = document.getElementById("seatMap");
  if (!seatMap) return;

  seatMap.innerHTML = "";

  const room        = record.roomData || {};
  const assignments = Array.isArray(room.assignments) ? room.assignments : [];


  /* ---- STANDARD ---- */

  if (room.type === "standard") {

    const table   = document.createElement("table");
    table.className = "seating-table student-seating-table";

    let html = "<thead><tr><th>Row</th>";
    for (let col = 1; col <= Number(room.columns); col++) {
      html += `<th>Seat ${col}</th>`;
    }
    html += "</tr></thead><tbody>";

    for (let row = 1; row <= Number(room.rows); row++) {
      html += `<tr><th>Row ${row}</th>`;
      for (let col = 1; col <= Number(room.columns); col++) {
        const assignment = assignments.find((a) => a.row === row && a.column === col);
        const seat       = `R${row}-C${col}`;
        const isMySeat   = seat === record.seat;

        if (isMySeat) {
          html += `
            <td class="student-seat-cell my-seat">
              <span class="student-seat-label">${seat}</span>
              <span class="student-seat-status">YOUR SEAT</span>
            </td>`;
        } else if (assignment) {
          html += `
            <td class="student-seat-cell occupied-seat">
              <span class="student-seat-label">${seat}</span>
              <span class="student-seat-status">Occupied</span>
            </td>`;
        } else {
          html += `
            <td class="student-seat-cell available-seat">
              <span class="student-seat-label">${seat}</span>
              <span class="student-seat-status">Available</span>
            </td>`;
        }
      }
      html += "</tr>";
    }
    html += "</tbody>";
    table.innerHTML = html;
    seatMap.appendChild(table);
  }


  /* ---- BENCH ---- */

  else if (room.type === "bench") {

    const table   = document.createElement("table");
    table.className = "seating-table student-seating-table";

    let html = "<thead><tr><th>Row</th>";
    for (let bench = 1; bench <= Number(room.benchesPerRow); bench++) {
      html += `<th>Bench ${bench}</th>`;
    }
    html += "</tr></thead><tbody>";

    for (let row = 1; row <= Number(room.rows); row++) {
      html += `<tr><th>Row ${row}</th>`;
      for (let bench = 1; bench <= Number(room.benchesPerRow); bench++) {
        const first      = assignments.find((a) => a.row === row && a.bench === bench && a.position === 1);
        const second     = assignments.find((a) => a.row === row && a.bench === bench && a.position === 2);
        const firstSeat  = `R${row}-B${bench}-P1`;
        const secondSeat = `R${row}-B${bench}-P2`;
        const firstMine  = firstSeat  === record.seat;
        const secondMine = secondSeat === record.seat;

        html += `
          <td class="bench-seat-cell">
            <div class="bench-seat student-bench-seat">
              <span class="${firstMine ? "my-seat" : first ? "occupied-seat" : "available-seat"}">
                <strong>${firstSeat}</strong>
                <small>${firstMine ? "YOUR SEAT" : first ? "Occupied" : "Available"}</small>
              </span>
              <span class="${secondMine ? "my-seat" : second ? "occupied-seat" : "available-seat"}">
                <strong>${secondSeat}</strong>
                <small>${secondMine ? "YOUR SEAT" : second ? "Occupied" : "Available"}</small>
              </span>
            </div>
          </td>`;
      }
      html += "</tr>";
    }
    html += "</tbody>";
    table.innerHTML = html;
    seatMap.appendChild(table);
  }


  /* ---- Room info ---- */

  document.getElementById("mapRoom").textContent = record.room;
  document.getElementById("visualisationSummary").textContent =
    `${record.studentName}, your allocated seat is ${record.seat} in Room ${record.room}.`;
}


/* =========================================================
   NAVIGATION
   ========================================================= */

studentLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showStudentView(link.dataset.view);
  });
});

document.querySelectorAll("[data-go-to]").forEach((button) => {
  button.addEventListener("click", () => showStudentView(button.dataset.goTo));
});


/* =========================================================
   SEAT FINDER FORM
   ========================================================= */

seatFinder.addEventListener("submit", (event) => {

  event.preventDefault();

  if (!seatFinder.checkValidity()) {
    formMessage.textContent = "Please complete your Student ID, name, and examination.";
    formMessage.className   = "form-message error-message";
    seatResult.hidden = true;
    seatFinder.reportValidity();
    return;
  }

  const studentId   = normalise(seatFinder.studentId.value);
  const studentName = normalise(seatFinder.studentName.value);
  const examId      = seatFinder.studentExam.value;

  /* ---- data from in-memory cache ---- */

  const examinations = getExaminations();
  const students     = getStudents();
  const seatingPlans = getSeatingPlans();

  const exam = examinations.find((item) => item.id === examId);

  if (!exam) {
    activeSeatRecord = null;
    seatResult.hidden = true;
    formMessage.textContent = "Please select a valid examination.";
    formMessage.className   = "form-message error-message";
    return;
  }

  const plan = seatingPlans.find(
    (item) => item.examId === examId && item.status === "Finalized"
  );

  if (!plan) {
    activeSeatRecord = null;
    seatResult.hidden = true;
    formMessage.textContent = "The seating plan for this examination has not been finalized yet.";
    formMessage.className   = "form-message error-message";
    return;
  }

  const student = students.find(
    (item) =>
      normalise(item.studentId) === studentId &&
      normalise(item.name || item.studentName) === studentName
  );

  if (!student) {
    activeSeatRecord = null;
    seatResult.hidden = true;
    formMessage.textContent = "Student ID and full name do not match our records.";
    formMessage.className   = "form-message error-message";
    return;
  }

  const assignment = Array.isArray(plan.assignments)
    ? plan.assignments.find(
        (item) =>
          item.studentId === student.id ||
          item.studentId === student.studentId
      )
    : null;

  if (!assignment) {
    activeSeatRecord = null;
    seatResult.hidden = true;
    formMessage.textContent = "No seat has been assigned to you for this examination.";
    formMessage.className   = "form-message error-message";
    return;
  }

  /* ---- Build record ---- */

  const roomPlan = Array.isArray(plan.rooms)
    ? plan.rooms.find((r) => r.roomId === assignment.roomId)
    : null;

  const roomName = roomPlan?.roomName || assignment.roomName || assignment.room || "Assigned room";
  const seat     = assignment.seat || assignment.seatNumber || "—";

  activeSeatRecord = {
    studentId:   student.studentId || student.id,
    studentName: student.name || student.studentName,
    exam:        exam.id,
    examLabel:   exam.name || "Examination",
    room:        roomName,
    seat:        seat,
    roomData:    roomPlan || null
  };

  /* ---- Display result ---- */

  document.getElementById("resultStudent").textContent = activeSeatRecord.studentName;
  document.getElementById("resultExam").textContent    = activeSeatRecord.examLabel;
  document.getElementById("resultRoom").textContent    = `Room ${activeSeatRecord.room}`;
  document.getElementById("resultSeat").textContent    = activeSeatRecord.seat;

  formMessage.textContent = "";
  formMessage.className   = "form-message";
  seatResult.hidden       = false;

});


/* =========================================================
   VIEW SEAT MAP BUTTON
   ========================================================= */

document.getElementById("viewVisualisation").addEventListener("click", () => {
  if (!activeSeatRecord) return;
  renderSeatMap(activeSeatRecord);
  showStudentView("seat-visualisation");
});

document.getElementById("backToResult").addEventListener("click", () => {
  showStudentView("find-my-seat");
});

window.addEventListener("popstate", () => {
  showStudentView(window.location.hash.slice(1), false);
});


/* =========================================================
   INITIAL LOAD
   Fetch all data from the API, then show the correct view.
   ========================================================= */

async function initStudentPage() {

  try {
    await loadAll();
  } catch (error) {
    console.error("Failed to load data:", error);
  }

  populateExamSelect();

  showStudentView(
    window.location.hash.slice(1),
    false
  );
}

initStudentPage();


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutExamSeat() {
  localStorage.removeItem("examSeatToken");
  localStorage.removeItem("examSeatSession");
  window.location.replace("index.html");
}
