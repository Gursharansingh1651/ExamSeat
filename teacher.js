"use strict";

/* =========================================================
   TEACHER VIEW / NAVIGATION
   ========================================================= */

const teacherViews = document.querySelectorAll(".screen");
const teacherLinks = document.querySelectorAll("[data-view]");
const teacherTitle = document.getElementById("pageTitle");
const teacherSidebar = document.getElementById("teacherSidebar");
const teacherOverlay = document.getElementById("overlay");


/* =========================================================
   EXAMINATION ELEMENTS
   ========================================================= */

const examinationForm =
  document.getElementById("examinationForm");

const examinationList =
  document.getElementById("examinationList");

const examinationEmpty =
  document.getElementById("examinationEmpty");

const examinationSuccess =
  document.getElementById("examinationSuccess");

const workspaceExamName =
  document.getElementById("workspaceExamName");

const workspaceExamMeta =
  document.getElementById("workspaceExamMeta");

const workspaceStudentList =
  document.getElementById("workspaceStudentList");

const workspaceStudentCount =
  document.getElementById("workspaceStudentCount");

const workspaceSelectedCount =
  document.getElementById("workspaceSelectedCount");

const workspaceStudentEmpty =
  document.getElementById("workspaceStudentEmpty");

const workspaceStudentSearch =
  document.getElementById("workspaceStudentSearch");

const workspaceSaveMessage =
  document.getElementById("workspaceSaveMessage");

const workspaceSelectAll =
  document.getElementById("workspaceSelectAll");

const workspaceSaveStudents =
  document.getElementById("workspaceSaveStudents");

const workspaceRoomList =
  document.getElementById("workspaceRoomList");

const workspaceRoomCount =
  document.getElementById("workspaceRoomCount");

const workspaceSelectedRoomCount =
  document.getElementById("workspaceSelectedRoomCount");

const workspaceRoomEmpty =
  document.getElementById("workspaceRoomEmpty");

const workspaceRoomSearch =
  document.getElementById("workspaceRoomSearch");

const workspaceRoomSelectAll =
  document.getElementById("workspaceRoomSelectAll");

const workspaceSaveRooms =
  document.getElementById("workspaceSaveRooms");

const workspaceRoomSaveMessage =
  document.getElementById("workspaceRoomSaveMessage");


/* =========================================================
   SEATING PLAN ELEMENTS
   ========================================================= */

const seatingExamSelect =
  document.getElementById("seatingExamSelect");

const seatingStudentCount =
  document.getElementById("seatingStudentCount");

const seatingRoomCount =
  document.getElementById("seatingRoomCount");

const seatingCapacity =
  document.getElementById("seatingCapacity");

const seatingCapacityMessage =
  document.getElementById("seatingCapacityMessage");

const seatingPlanStatusBadge =
  document.getElementById("seatingPlanStatusBadge");

const seatingPlanMessage =
  document.getElementById("seatingPlanMessage");

const generateSeatingButton =
  document.getElementById("generateSeatingButton");

const seatingRegenerateButton =
  document.getElementById("seatingRegenerateButton");

const finalizeSeatingButton =
  document.getElementById("finalizeSeatingButton");

const finalizeModalBackdrop =
  document.getElementById("finalizeModalBackdrop");

const cancelFinalizeButton =
  document.getElementById("cancelFinalizeButton");

const confirmFinalizeButton =
  document.getElementById("confirmFinalizeButton");

const finalizeModalStudents =
  document.getElementById("finalizeModalStudents");

const finalizeModalRooms =
  document.getElementById("finalizeModalRooms");

const finalizeModalConflicts =
  document.getElementById("finalizeModalConflicts");

const seatingPlanPreview =
  document.getElementById("seatingPlanPreview");

const printSeatingButton =
  document.getElementById("printSeatingButton");

const seatingPlanEmpty =
  document.getElementById("seatingPlanEmpty");

const seatingPreviewTitle =
  document.getElementById("seatingPreviewTitle");

const seatingPreviewMeta =
  document.getElementById("seatingPreviewMeta");

const seatingRoomList =
  document.getElementById("seatingRoomList");

const seatingReviewPanel =
  document.getElementById("seatingReviewPanel");

const seatingReviewStatus =
  document.getElementById("seatingReviewStatus");

const reviewAssignedStudents =
  document.getElementById("reviewAssignedStudents");

const reviewRoomsUsed =
  document.getElementById("reviewRoomsUsed");

const reviewSeatsAvailable =
  document.getElementById("reviewSeatsAvailable");

const reviewUnassignedStudents =
  document.getElementById("reviewUnassignedStudents");

const reviewConflictCount =
  document.getElementById("reviewConflictCount");

const seatingReviewMessage =
  document.getElementById("seatingReviewMessage");


/* =========================================================
   ROOM ELEMENTS
   ========================================================= */

const roomForm =
  document.getElementById("roomForm");

const roomList =
  document.getElementById("roomList");

const roomEmpty =
  document.getElementById("roomEmpty");

const roomType =
  document.getElementById("roomType");

const standardRoomConfig =
  document.getElementById("standardRoomConfig");

const benchRoomConfig =
  document.getElementById("benchRoomConfig");

const roomCapacityPreview =
  document.getElementById("roomCapacityPreview");

const roomCapacity =
  document.getElementById("roomCapacity");

const roomFormMessage =
  document.getElementById("roomFormMessage");


/* =========================================================
   STUDENT ELEMENTS
   ========================================================= */

const studentForm =
  document.getElementById("studentForm");

const studentList =
  document.getElementById("studentList");

const studentEmpty =
  document.getElementById("studentEmpty");

const studentNoResults =
  document.getElementById("studentNoResults");

const studentSearch =
  document.getElementById("studentSearch");

const studentCount =
  document.getElementById("studentCount");


/* =========================================================
   API HELPERS
   Thin wrappers around fetch that always include the JWT.
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

async function apiPost(path, body) {
  const response = await fetch(path, {
    method:  "POST",
    headers: authHeaders(),
    body:    JSON.stringify(body)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `POST ${path} failed`);
  }
  return response.json();
}

async function apiPut(path, body) {
  const response = await fetch(path, {
    method:  "PUT",
    headers: authHeaders(),
    body:    JSON.stringify(body)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `PUT ${path} failed`);
  }
  return response.json();
}

async function apiDelete(path) {
  const response = await fetch(path, {
    method:  "DELETE",
    headers: authHeaders()
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `DELETE ${path} failed`);
  }
  return response.json();
}


/* =========================================================
   IN-MEMORY CACHE
   Loaded once per page and kept in sync after writes.
   Mirrors what localStorage provided: a single source of
   truth for all render functions.
   ========================================================= */

let _examinations = [];
let _students     = [];
let _rooms        = [];
let _seatingPlans = [];


/* =========================================================
   DATA LOADERS
   ========================================================= */

async function loadExaminations() {
  const data = await apiGet("/api/examinations");
  _examinations = Array.isArray(data.examinations) ? data.examinations : [];
  /* Normalise _id → id so existing render code keeps working */
  _examinations = _examinations.map(normaliseId);
  return _examinations;
}

async function loadStudents() {
  const data = await apiGet("/api/students");
  _students = Array.isArray(data.students) ? data.students : [];
  _students = _students.map(normaliseId);
  return _students;
}

async function loadRooms() {
  const data = await apiGet("/api/rooms");
  _rooms = Array.isArray(data.rooms) ? data.rooms : [];
  _rooms = _rooms.map(normaliseId);
  return _rooms;
}

async function loadSeatingPlans() {
  const data = await apiGet("/api/seating-plans");
  _seatingPlans = Array.isArray(data.seatingPlans) ? data.seatingPlans : [];
  _seatingPlans = _seatingPlans.map(normaliseId);
  return _seatingPlans;
}

/* MongoDB uses _id; existing code uses .id — bridge the gap */
function normaliseId(obj) {
  if (!obj) return obj;
  if (!obj.id && obj._id) {
    return { ...obj, id: String(obj._id) };
  }
  return obj;
}


/* =========================================================
   SYNCHRONOUS ACCESSORS
   Called by all rendering functions exactly as before.
   ========================================================= */

function getExaminations()  { return _examinations; }
function getStudents()      { return _students;     }
function getRooms()         { return _rooms;        }
function getSeatingPlans()  { return _seatingPlans; }

function getExaminationById(examId) {
  return _examinations.find((exam) => exam.id === examId) || null;
}

function getSeatingPlanForExam(examId) {
  return _seatingPlans.find((plan) => plan.examId === examId) || null;
}


/* =========================================================
   EXAMINATION FORMATTING
   ========================================================= */

function formatExamDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? dateValue
    : date.toLocaleDateString(undefined, {
        day:   "numeric",
        month: "short",
        year:  "numeric"
      });
}

function formatExamTime(timeValue) {
  if (!timeValue) return "";
  const [hours, minutes] = timeValue.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}


/* =========================================================
   RENDER EXAMINATIONS
   ========================================================= */

function renderExaminations() {

  if (!examinationList || !examinationEmpty) return;

  const examinations = getExaminations().sort(
    (first, second) =>
      `${first.date}${first.startTime}`.localeCompare(
        `${second.date}${second.startTime}`
      )
  );

  examinationList.innerHTML = "";
  examinationEmpty.hidden = examinations.length > 0;

  examinations.forEach((exam) => {

    const card = document.createElement("article");
    card.className = "examination-card panel";

    card.innerHTML = `
      <div class="examination-card-top">
        <div>
          <p class="eyebrow">${exam.subject}</p>
          <h3>${exam.name}</h3>
        </div>
        <span class="status-badge">${exam.status}</span>
      </div>

      <div class="exam-meta">
        <span><b>Date</b> ${formatExamDate(exam.date)}</span>
        <span><b>Time</b> ${formatExamTime(exam.startTime)}</span>
        <span><b>Duration</b> ${exam.duration}</span>
        <span><b>Students</b> ${exam.studentCount || (exam.studentIds || []).length}</span>
        <span><b>Rooms</b> ${exam.roomCount || (exam.roomIds || []).length}</span>
      </div>

      ${exam.description
        ? `<p class="exam-description">${exam.description}</p>`
        : ""}

      <div class="examination-card-actions">
        <button class="button button-secondary examination-manage-students"
          type="button" data-exam-id="${exam.id}">
          Manage Students
        </button>
        <button class="button button-secondary examination-manage-rooms"
          type="button" data-exam-id="${exam.id}">
          Manage Rooms
        </button>
        <button class="button button-secondary examination-delete-button"
          type="button" data-exam-id="${exam.id}">
          Delete Examination
        </button>
      </div>
    `;

    examinationList.appendChild(card);
  });
}


/* =========================================================
   EXAMINATION → STUDENT WORKSPACE
   ========================================================= */

let activeWorkspaceExamId = null;

function renderWorkspaceStudents(searchTerm = "") {

  if (!workspaceStudentList || !activeWorkspaceExamId) return;

  const exam     = getExaminationById(activeWorkspaceExamId);
  const students = getStudents();

  if (!exam) return;

  const selectedIds = new Set(
    Array.isArray(exam.studentIds) ? exam.studentIds : []
  );

  const query = searchTerm.trim().toLowerCase();

  const filteredStudents = students.filter((student) => {
    if (!query) return true;
    return (
      String(student.studentId).toLowerCase().includes(query) ||
      String(student.name).toLowerCase().includes(query) ||
      String(student.course).toLowerCase().includes(query)
    );
  });

  workspaceStudentList.innerHTML = "";

  if (workspaceStudentCount) {
    workspaceStudentCount.textContent =
      `${students.length} ${students.length === 1 ? "student" : "students"}`;
  }

  if (workspaceSelectedCount) {
    workspaceSelectedCount.textContent = `${selectedIds.size} selected`;
  }

  if (students.length === 0) {
    workspaceStudentEmpty.hidden = false;
    workspaceStudentList.hidden  = true;
    workspaceSelectAll.disabled  = true;
    workspaceSaveStudents.disabled = true;
    return;
  }

  workspaceStudentEmpty.hidden   = true;
  workspaceStudentList.hidden    = false;
  workspaceSelectAll.disabled    = false;
  workspaceSaveStudents.disabled = false;

  if (filteredStudents.length === 0) {
    workspaceStudentList.innerHTML =
      `<div class="workspace-no-results">No students match your search.</div>`;
    workspaceSelectAll.checked       = false;
    workspaceSelectAll.indeterminate = false;
    return;
  }

  filteredStudents.forEach((student) => {
    const row = document.createElement("label");
    row.className = "workspace-student-row";
    row.innerHTML = `
      <input class="workspace-student-checkbox" type="checkbox"
        value="${student.id}"
        ${selectedIds.has(student.id) ? "checked" : ""}>
      <span class="workspace-student-main">
        <strong>${student.name}</strong>
        <small>
          ${student.studentId} · ${student.course} .
          ${student.subject || "-"}
          ${student.section ? ` · ${student.section}` : ""}
        </small>
      </span>
    `;
    workspaceStudentList.appendChild(row);
  });

  updateWorkspaceSelectAllState();
}


function updateWorkspaceSelectAllState() {

  if (!workspaceSelectAll || !workspaceStudentList) return;

  const checkboxes = [
    ...workspaceStudentList.querySelectorAll(".workspace-student-checkbox")
  ];

  const checkedCount = checkboxes.filter((cb) => cb.checked).length;

  workspaceSelectAll.checked =
    checkboxes.length > 0 && checkedCount === checkboxes.length;

  workspaceSelectAll.indeterminate =
    checkedCount > 0 && checkedCount < checkboxes.length;
}


function openExaminationStudentWorkspace(examId) {

  const exam = getExaminationById(examId);
  if (!exam) return;

  activeWorkspaceExamId = examId;

  if (workspaceExamName) workspaceExamName.textContent = exam.name;

  if (workspaceExamMeta) {
    workspaceExamMeta.textContent =
      `${exam.subject} · ${formatExamDate(exam.date)} · ${formatExamTime(exam.startTime)} · ${exam.duration}`;
  }

  if (workspaceStudentSearch) workspaceStudentSearch.value = "";
  if (workspaceSaveMessage)   workspaceSaveMessage.textContent = "";

  renderWorkspaceStudents();
  showTeacherView("examination-workspace");
}


async function saveWorkspaceStudents() {

  if (!activeWorkspaceExamId || !workspaceStudentList) return;

  const selectedIds = [
    ...workspaceStudentList.querySelectorAll(".workspace-student-checkbox:checked")
  ].map((cb) => cb.value);

  try {

    const data = await apiPut(
      `/api/examinations/${activeWorkspaceExamId}/students`,
      { studentIds: selectedIds }
    );

    /* Update cache */
    const updated = normaliseId(data.examination);
    const index   = _examinations.findIndex((e) => e.id === activeWorkspaceExamId);
    if (index !== -1) _examinations[index] = updated;

    renderExaminations();
    renderWorkspaceStudents(
      workspaceStudentSearch ? workspaceStudentSearch.value : ""
    );

    if (workspaceSaveMessage) {
      workspaceSaveMessage.textContent =
        `${selectedIds.length} ${selectedIds.length === 1 ? "student has" : "students have"} been assigned to this examination.`;
    }

  } catch (error) {
    if (workspaceSaveMessage) {
      workspaceSaveMessage.textContent = `Error: ${error.message}`;
    }
  }
}


/* =========================================================
   ROOM WORKSPACE
   ========================================================= */

function renderWorkspaceRooms(searchTerm = "") {

  if (!workspaceRoomList || !activeWorkspaceExamId) return;

  const exam  = getExaminationById(activeWorkspaceExamId);
  const rooms = getRooms();

  if (!exam) return;

  const selectedIds = new Set(
    Array.isArray(exam.roomIds) ? exam.roomIds : []
  );

  const query = searchTerm.trim().toLowerCase();

  const filteredRooms = rooms.filter((room) => {
    if (!query) return true;
    return (
      String(room.name).toLowerCase().includes(query) ||
      String(room.type).toLowerCase().includes(query)
    );
  });

  workspaceRoomList.innerHTML = "";

  if (workspaceRoomCount) {
    workspaceRoomCount.textContent =
      `${rooms.length} ${rooms.length === 1 ? "room" : "rooms"}`;
  }

  if (workspaceSelectedRoomCount) {
    workspaceSelectedRoomCount.textContent = `${selectedIds.size} selected`;
  }

  if (rooms.length === 0) {
    workspaceRoomEmpty.hidden    = false;
    workspaceRoomList.hidden     = true;
    workspaceRoomSelectAll.disabled = true;
    workspaceSaveRooms.disabled  = true;
    return;
  }

  workspaceRoomEmpty.hidden    = true;
  workspaceRoomList.hidden     = false;
  workspaceRoomSelectAll.disabled = false;
  workspaceSaveRooms.disabled  = false;

  if (filteredRooms.length === 0) {
    workspaceRoomList.innerHTML =
      `<div class="workspace-no-results">No rooms match your search.</div>`;
    workspaceRoomSelectAll.checked       = false;
    workspaceRoomSelectAll.indeterminate = false;
    return;
  }

  filteredRooms.forEach((room) => {
    const row = document.createElement("label");
    row.className = "workspace-student-row";

    const roomTypeLabel =
      room.type === "standard" ? "Standard Classroom" : "Bench Classroom";

    const configuration =
      room.type === "standard"
        ? `${room.rows} rows × ${room.columns} columns`
        : `${room.rows} rows × ${room.benchesPerRow} benches`;

    row.innerHTML = `
      <input class="workspace-room-checkbox" type="checkbox"
        value="${room.id}"
        ${selectedIds.has(room.id) ? "checked" : ""}>
      <span class="workspace-student-main">
        <strong>${room.name}</strong>
        <small>${roomTypeLabel} · ${configuration} · ${room.capacity} seats</small>
      </span>
    `;
    workspaceRoomList.appendChild(row);
  });

  updateWorkspaceRoomSelectAllState();
}


function updateWorkspaceRoomSelectAllState() {

  if (!workspaceRoomSelectAll || !workspaceRoomList) return;

  const checkboxes = [
    ...workspaceRoomList.querySelectorAll(".workspace-room-checkbox")
  ];

  const checkedCount = checkboxes.filter((cb) => cb.checked).length;

  if (workspaceSelectedRoomCount) {
    workspaceSelectedRoomCount.textContent = `${checkedCount} selected`;
  }

  workspaceRoomSelectAll.checked =
    checkboxes.length > 0 && checkedCount === checkboxes.length;

  workspaceRoomSelectAll.indeterminate =
    checkedCount > 0 && checkedCount < checkboxes.length;
}


function openExaminationRoomWorkspace(examId) {

  const exam = getExaminationById(examId);
  if (!exam) return;

  activeWorkspaceExamId = examId;

  if (workspaceExamName) workspaceExamName.textContent = exam.name;

  if (workspaceExamMeta) {
    workspaceExamMeta.textContent =
      `${exam.subject} · ${formatExamDate(exam.date)} · ${formatExamTime(exam.startTime)} · ${exam.duration}`;
  }

  if (workspaceRoomSearch)       workspaceRoomSearch.value = "";
  if (workspaceRoomSaveMessage)  workspaceRoomSaveMessage.textContent = "";

  renderWorkspaceRooms();
  showTeacherView("examination-room-workspace");
}


async function saveWorkspaceRooms() {

  if (!activeWorkspaceExamId || !workspaceRoomList) return;

  const selectedIds = [
    ...workspaceRoomList.querySelectorAll(".workspace-room-checkbox:checked")
  ].map((cb) => cb.value);

  try {

    const data = await apiPut(
      `/api/examinations/${activeWorkspaceExamId}/rooms`,
      { roomIds: selectedIds }
    );

    /* Update cache */
    const updated = normaliseId(data.examination);
    const index   = _examinations.findIndex((e) => e.id === activeWorkspaceExamId);
    if (index !== -1) _examinations[index] = updated;

    renderExaminations();
    renderWorkspaceRooms(
      workspaceRoomSearch ? workspaceRoomSearch.value : ""
    );

    if (workspaceRoomSaveMessage) {
      workspaceRoomSaveMessage.textContent =
        selectedIds.length === 0
          ? "No rooms are assigned to this examination."
          : `${selectedIds.length} ${selectedIds.length === 1 ? "room has" : "rooms have"} been assigned to this examination.`;
    }

  } catch (error) {

    /* 409 = room time conflict (server checked it for us) */
    if (workspaceRoomSaveMessage) {
      workspaceRoomSaveMessage.textContent = `Cannot assign these rooms. ${error.message}`;
    }
  }
}


/* =========================================================
   RENDER ROOMS
   ========================================================= */

function renderRooms() {

  if (!roomList || !roomEmpty) return;

  const rooms = getRooms();

  roomList.innerHTML = "";
  roomEmpty.hidden = rooms.length > 0;

  rooms.forEach((room) => {

    const card = document.createElement("article");
    card.className = "room-card panel";

    let roomTypeLabel    = "";
    let configurationText = "";

    if (room.type === "standard") {
      roomTypeLabel     = "Standard Classroom";
      configurationText = `${room.rows} rows × ${room.columns} columns`;
    } else {
      roomTypeLabel     = "Bench Classroom";
      configurationText = `${room.rows} rows × ${room.benchesPerRow} benches`;
    }

    card.innerHTML = `
      <div class="room-card-top">
        <div>
          <p class="eyebrow">${roomTypeLabel}</p>
          <h3>${room.name}</h3>
        </div>
        <span class="status-badge">${room.capacity} seats</span>
      </div>

      <div class="room-meta">
        <span><b>Configuration</b> ${configurationText}</span>
        <span><b>Capacity</b> ${room.capacity} students</span>
        ${room.type === "bench"
          ? `<span><b>Students / Bench</b> 2</span>`
          : ""}
      </div>

      <div class="room-card-actions">
        <button class="text-button room-delete-button"
          type="button" data-room-id="${room.id}">
          Delete
        </button>
      </div>
    `;

    roomList.appendChild(card);
  });
}


/* =========================================================
   RENDER STUDENTS
   ========================================================= */

function renderStudents(searchTerm = "") {

  if (!studentList) return;

  const students = getStudents();
  const query    = searchTerm.trim().toLowerCase();

  const filteredStudents = students.filter((student) => {
    if (!query) return true;
    return (
      student.studentId.toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query)
    );
  });

  studentList.innerHTML = "";

  if (studentCount) {
    studentCount.textContent =
      `${students.length} ${students.length === 1 ? "student" : "students"}`;
  }

  if (students.length === 0) {
    studentEmpty.hidden    = false;
    studentNoResults.hidden = true;
    return;
  }

  studentEmpty.hidden = true;

  if (filteredStudents.length === 0) {
    studentNoResults.hidden = false;
    return;
  }

  studentNoResults.hidden = true;

  filteredStudents.forEach((student) => {
    const card = document.createElement("article");
    card.className = "student-card panel";

    card.innerHTML = `
      <div class="student-card-top">
        <div>
          <p class="eyebrow">Candidate</p>
          <h3>${student.name}</h3>
        </div>
        <span class="student-id-badge">ID: ${student.studentId}</span>
      </div>

      <div class="student-meta">
        <span><b>Course / Class</b> ${student.course}</span>
        <span><b>Subject</b> ${student.subject || "-"}</span>
        ${student.section
          ? `<span><b>Section</b> ${student.section}</span>`
          : ""}
      </div>

      <div class="student-card-actions">
        <button class="text-button student-delete-button"
          type="button" data-student-id="${student.id}">
          Delete
        </button>
      </div>
    `;

    studentList.appendChild(card);
  });
}


/* =========================================================
   DASHBOARD STATS
   ========================================================= */

function updateDashboardStats() {

  const students    = getStudents();
  const rooms       = getRooms();
  const seatingPlans = getSeatingPlans();

  const studentCountEl = document.getElementById("dashboardStudentCount");
  if (studentCountEl) studentCountEl.textContent = students.length;

  const roomCountEl = document.getElementById("dashboardRoomCount");
  if (roomCountEl) roomCountEl.textContent = rooms.length;

  let totalSeats = 0;
  rooms.forEach((room) => {
    if (room.type === "standard") {
      totalSeats += Number(room.rows || 0) * Number(room.columns || 0);
    } else if (room.type === "bench") {
      totalSeats +=
        Number(room.rows || 0) *
        Number(room.benchesPerRow || 0) *
        Number(room.studentsPerBench || 0);
    } else {
      totalSeats += Number(room.capacity || 0);
    }
  });

  let assignedSeats = 0;
  seatingPlans.forEach((plan) => {
    if (Array.isArray(plan.assignments)) {
      assignedSeats += plan.assignments.length;
    }
  });

  const availableSeats = Math.max(totalSeats - assignedSeats, 0);

  const availableSeatsEl = document.getElementById("dashboardAvailableSeats");
  if (availableSeatsEl) availableSeatsEl.textContent = availableSeats;

  let conflictCount = 0;
  seatingPlans.forEach((plan) => {
    if (Array.isArray(plan.conflicts)) {
      conflictCount += plan.conflicts.length;
    }
  });

  const conflictEl = document.getElementById("dashboardConflictCount");
  if (conflictEl) conflictEl.textContent = conflictCount;
}


/* =========================================================
   ROOM TYPE UI
   ========================================================= */

function updateRoomTypeUI() {

  if (!roomType) return;

  const selectedType = roomType.value;

  if (standardRoomConfig) standardRoomConfig.hidden = selectedType !== "standard";
  if (benchRoomConfig)    benchRoomConfig.hidden    = selectedType !== "bench";
  if (roomCapacityPreview) roomCapacityPreview.hidden = true;
  if (roomCapacity)        roomCapacity.textContent   = "0";
  if (roomFormMessage)     roomFormMessage.textContent = "";
}


/* =========================================================
   ROOM CAPACITY CALCULATION
   ========================================================= */

function updateRoomCapacity() {

  if (!roomType) return;

  let capacity = 0;

  if (roomType.value === "standard") {
    const rows    = Number(document.getElementById("roomRows").value);
    const columns = Number(document.getElementById("roomColumns").value);
    if (rows > 0 && columns > 0) capacity = rows * columns;
  } else if (roomType.value === "bench") {
    const rows   = Number(document.getElementById("benchRows").value);
    const benches = Number(document.getElementById("benchesPerRow").value);
    if (rows > 0 && benches > 0) capacity = rows * benches * 2;
  }

  if (roomCapacity)        roomCapacity.textContent    = capacity;
  if (roomCapacityPreview) roomCapacityPreview.hidden  = capacity <= 0;
}


/* =========================================================
   FORM VALIDATION — ROOM
   ========================================================= */

function clearRoomErrors() {

  ["Name","Type","Rows","Columns","BenchRows","BenchesPerRow"].forEach((field) => {
    const error = document.getElementById(`room${field}Error`);
    if (error) error.textContent = "";
  });

  if (roomFormMessage) roomFormMessage.textContent = "";
}

function validateRoomForm() {

  clearRoomErrors();

  let valid = true;

  const nameInput = document.getElementById("roomName");

  if (!nameInput.value.trim()) {
    document.getElementById("roomNameError").textContent = "Room name is required.";
    nameInput.setAttribute("aria-invalid", "true");
    valid = false;
  } else {
    nameInput.removeAttribute("aria-invalid");
  }

  if (!roomType.value) {
    document.getElementById("roomTypeError").textContent = "Please select a room type.";
    valid = false;
  }

  if (roomType.value === "standard") {
    const rows    = Number(document.getElementById("roomRows").value);
    const columns = Number(document.getElementById("roomColumns").value);
    if (rows <= 0)    { document.getElementById("roomRowsError").textContent    = "Enter a valid number of rows.";    valid = false; }
    if (columns <= 0) { document.getElementById("roomColumnsError").textContent = "Enter a valid number of columns."; valid = false; }
  }

  if (roomType.value === "bench") {
    const rows   = Number(document.getElementById("benchRows").value);
    const benches = Number(document.getElementById("benchesPerRow").value);
    if (rows <= 0)   { document.getElementById("benchRowsError").textContent    = "Enter a valid number of rows.";    valid = false; }
    if (benches <= 0) { document.getElementById("benchesPerRowError").textContent = "Enter a valid number of benches."; valid = false; }
  }

  if (!valid && roomFormMessage) {
    roomFormMessage.textContent = "Please correct the highlighted fields.";
  }

  return valid;
}


/* =========================================================
   FORM VALIDATION — STUDENT
   ========================================================= */

function clearStudentErrors() {

  ["studentId","studentName","studentCourse"].forEach((id) => {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}Error`);
    if (input) input.removeAttribute("aria-invalid");
    if (error) error.textContent = "";
  });

  document.getElementById("studentFormMessage").textContent = "";
}

function validateStudentForm() {

  clearStudentErrors();

  let valid = true;

  const studentId    = document.getElementById("studentId");
  const studentName  = document.getElementById("studentName");
  const studentCourse = document.getElementById("studentCourse");

  if (!studentId.value.trim()) {
    document.getElementById("studentIdError").textContent = "Student ID is required.";
    studentId.setAttribute("aria-invalid", "true");
    valid = false;
  }

  if (!studentName.value.trim()) {
    document.getElementById("studentNameError").textContent = "Student name is required.";
    studentName.setAttribute("aria-invalid", "true");
    valid = false;
  }

  if (!studentCourse.value.trim()) {
    document.getElementById("studentCourseError").textContent = "Course / Class is required.";
    studentCourse.setAttribute("aria-invalid", "true");
    valid = false;
  }

  /* Prevent duplicate student IDs in the current in-memory list */
  const duplicate = getStudents().some(
    (student) =>
      student.studentId.toLowerCase() === studentId.value.trim().toLowerCase()
  );

  if (duplicate) {
    document.getElementById("studentIdError").textContent = "This Student ID already exists.";
    studentId.setAttribute("aria-invalid", "true");
    valid = false;
  }

  if (!valid) {
    document.getElementById("studentFormMessage").textContent =
      "Please correct the highlighted fields.";
  }

  return valid;
}


/* =========================================================
   FORM VALIDATION — EXAMINATION
   ========================================================= */

function clearFieldErrors() {

  ["Name","Subject","Date","StartTime","Duration"].forEach((field) => {
    const error = document.getElementById(`exam${field}Error`);
    const input = document.getElementById(`exam${field}`);
    if (error) error.textContent = "";
    if (input) input.removeAttribute("aria-invalid");
  });

  document.getElementById("examFormMessage").textContent = "";
}

function validateExaminationForm() {

  const fields = [
    { id: "examName",      label: "Examination name" },
    { id: "examSubject",   label: "Subject"          },
    { id: "examDate",      label: "Date"             },
    { id: "examStartTime", label: "Start time"       },
    { id: "examDuration",  label: "Duration"         }
  ];

  clearFieldErrors();

  let valid = true;

  fields.forEach((field) => {
    const input = document.getElementById(field.id);
    if (!input.value.trim()) {
      document.getElementById(`${field.id}Error`).textContent =
        `${field.label} is required.`;
      input.setAttribute("aria-invalid", "true");
      valid = false;
    }
  });

  if (!valid) {
    document.getElementById("examFormMessage").textContent =
      "Please correct the highlighted fields before creating the examination.";
  }

  return valid;
}


/* =========================================================
   TEACHER VIEW SWITCHING
   ========================================================= */

function showTeacherView(viewId, updateHash = true) {

  const view =
    document.getElementById(viewId) ||
    document.getElementById("dashboard");

  teacherViews.forEach((item) => {
    const active = item === view;
    item.hidden = !active;
    item.classList.toggle("active", active);
  });

  teacherLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.view === view.id);
  });

  teacherTitle.textContent = view.dataset.title;

  /* Refresh page data */
  if (view.id === "examinations")                 renderExaminations();
  if (view.id === "rooms")                        renderRooms();
  if (view.id === "students")                     renderStudents();
  if (view.id === "examination-workspace")        renderWorkspaceStudents(workspaceStudentSearch ? workspaceStudentSearch.value : "");
  if (view.id === "examination-room-workspace")   renderWorkspaceRooms(workspaceRoomSearch ? workspaceRoomSearch.value : "");
  if (view.id === "seating-plans")                renderSeatingPlansPage();

  if (updateHash) history.pushState({ view: view.id }, "", `#${view.id}`);

  teacherSidebar.classList.remove("open");
  teacherOverlay.hidden = true;
}


/* =========================================================
   NAVIGATION
   ========================================================= */

teacherLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showTeacherView(link.dataset.view);
  });
});

document.querySelectorAll("[data-go-to]").forEach((button) => {
  button.addEventListener("click", () => showTeacherView(button.dataset.goTo));
});


/* =========================================================
   EXAMINATION FORM SUBMISSION
   ========================================================= */

if (examinationForm) {

  examinationForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!validateExaminationForm()) return;

    const body = {
      name:        document.getElementById("examName").value.trim(),
      subject:     document.getElementById("examSubject").value.trim(),
      date:        document.getElementById("examDate").value,
      startTime:   document.getElementById("examStartTime").value,
      duration:    document.getElementById("examDuration").value.trim(),
      description: document.getElementById("examDescription").value.trim()
    };

    try {

      const data = await apiPost("/api/examinations", body);

      /* Add to cache */
      _examinations.push(normaliseId(data.examination));

      examinationForm.reset();
      clearFieldErrors();

      examinationSuccess.textContent = `"${body.name}" was created as a draft.`;
      examinationSuccess.hidden = false;

      showTeacherView("examinations");

    } catch (error) {
      document.getElementById("examFormMessage").textContent =
        `Error: ${error.message}`;
    }
  });
}


/* =========================================================
   CANCEL EXAMINATION CREATION
   ========================================================= */

function cancelExaminationCreation() {
  examinationForm.reset();
  clearFieldErrors();
  showTeacherView("examinations");
}

document.getElementById("cancelCreate").addEventListener("click", cancelExaminationCreation);
document.getElementById("cancelCreateTop").addEventListener("click", cancelExaminationCreation);


/* =========================================================
   EXAMINATION LIST — click delegation
   ========================================================= */

if (examinationList) {

  examinationList.addEventListener("click", async (event) => {

    /* Manage Students */
    const manageStudentsBtn = event.target.closest(".examination-manage-students");
    if (manageStudentsBtn) {
      openExaminationStudentWorkspace(manageStudentsBtn.dataset.examId);
      return;
    }

    /* Manage Rooms */
    const manageRoomsBtn = event.target.closest(".examination-manage-rooms");
    if (manageRoomsBtn) {
      openExaminationRoomWorkspace(manageRoomsBtn.dataset.examId);
      return;
    }

    /* Delete Examination */
    const deleteBtn = event.target.closest(".examination-delete-button");
    if (!deleteBtn) return;

    const examId = deleteBtn.dataset.examId;
    const exam   = getExaminationById(examId);
    if (!exam) return;

    if (!window.confirm(`Are you sure you want to delete "${exam.name}"?`)) return;

    try {

      await apiDelete(`/api/examinations/${examId}`);

      /* Remove from cache */
      _examinations = _examinations.filter((e) => e.id !== examId);
      _seatingPlans = _seatingPlans.filter((p) => p.examId !== examId);

      renderExaminations();
      updateDashboardStats();

    } catch (error) {
      alert(`Could not delete: ${error.message}`);
    }
  });
}


/* =========================================================
   STUDENT WORKSPACE EVENTS
   ========================================================= */

if (workspaceStudentSearch) {
  workspaceStudentSearch.addEventListener("input", () => {
    renderWorkspaceStudents(workspaceStudentSearch.value);
  });
}

if (workspaceSelectAll) {
  workspaceSelectAll.addEventListener("change", () => {
    const checkboxes = [
      ...workspaceStudentList.querySelectorAll(".workspace-student-checkbox")
    ];
    checkboxes.forEach((cb) => { cb.checked = workspaceSelectAll.checked; });
    updateWorkspaceSelectAllState();
  });
}

if (workspaceStudentList) {
  workspaceStudentList.addEventListener("change", (event) => {
    if (event.target.classList.contains("workspace-student-checkbox")) {
      updateWorkspaceSelectAllState();
    }
  });
}

if (workspaceSaveStudents) {
  workspaceSaveStudents.addEventListener("click", saveWorkspaceStudents);
}


/* =========================================================
   ROOM WORKSPACE EVENTS
   ========================================================= */

if (workspaceRoomSearch) {
  workspaceRoomSearch.addEventListener("input", () => {
    renderWorkspaceRooms(workspaceRoomSearch.value);
  });
}

if (workspaceRoomSelectAll) {
  workspaceRoomSelectAll.addEventListener("change", () => {
    const checkboxes = [
      ...workspaceRoomList.querySelectorAll(".workspace-room-checkbox")
    ];
    checkboxes.forEach((cb) => { cb.checked = workspaceRoomSelectAll.checked; });
    updateWorkspaceRoomSelectAllState();
  });
}

if (workspaceRoomList) {
  workspaceRoomList.addEventListener("change", (event) => {
    if (event.target.classList.contains("workspace-room-checkbox")) {
      updateWorkspaceRoomSelectAllState();
    }
  });
}

if (workspaceSaveRooms) {
  workspaceSaveRooms.addEventListener("click", saveWorkspaceRooms);
}


/* =========================================================
   ROOM FORM EVENTS
   ========================================================= */

if (roomType) {
  roomType.addEventListener("change", () => {
    updateRoomTypeUI();
    updateRoomCapacity();
  });
}

["roomRows","roomColumns","benchRows","benchesPerRow"].forEach((id) => {
  const input = document.getElementById(id);
  if (input) input.addEventListener("input", updateRoomCapacity);
});


/* =========================================================
   ROOM FORM SUBMISSION
   ========================================================= */

if (roomForm) {

  roomForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!validateRoomForm()) return;

    const body = {
      name: document.getElementById("roomName").value.trim(),
      type: roomType.value
    };

    if (body.type === "standard") {
      body.rows    = Number(document.getElementById("roomRows").value);
      body.columns = Number(document.getElementById("roomColumns").value);
    } else {
      body.rows             = Number(document.getElementById("benchRows").value);
      body.benchesPerRow    = Number(document.getElementById("benchesPerRow").value);
      body.studentsPerBench = 2;
    }

    try {

      const data = await apiPost("/api/rooms", body);

      /* Add to cache */
      _rooms.push(normaliseId(data.room));

      roomForm.reset();
      clearRoomErrors();
      updateRoomTypeUI();
      updateDashboardStats();

      showTeacherView("rooms");
      renderRooms();

    } catch (error) {
      if (roomFormMessage) roomFormMessage.textContent = `Error: ${error.message}`;
    }
  });
}


/* =========================================================
   CANCEL ROOM CREATION
   ========================================================= */

function cancelRoomCreation() {
  roomForm.reset();
  clearRoomErrors();
  updateRoomTypeUI();
  showTeacherView("rooms");
}

const cancelRoomButton    = document.getElementById("cancelRoom");
const cancelRoomTopButton = document.getElementById("cancelRoomTop");
if (cancelRoomButton)    cancelRoomButton.addEventListener("click", cancelRoomCreation);
if (cancelRoomTopButton) cancelRoomTopButton.addEventListener("click", cancelRoomCreation);


/* =========================================================
   DELETE ROOM
   ========================================================= */

if (roomList) {

  roomList.addEventListener("click", async (event) => {

    const button = event.target.closest(".room-delete-button");
    if (!button) return;

    const roomId = button.dataset.roomId;

    try {

      await apiDelete(`/api/rooms/${roomId}`);

      /* Remove from cache */
      _rooms = _rooms.filter((r) => r.id !== roomId);

      /* Remove from any examination that referenced this room */
      _examinations = _examinations.map((exam) => {
        if (!Array.isArray(exam.roomIds)) return exam;
        const newRoomIds = exam.roomIds.filter((id) => id !== roomId);
        return { ...exam, roomIds: newRoomIds, roomCount: newRoomIds.length };
      });

      renderRooms();
      renderExaminations();
      updateDashboardStats();

    } catch (error) {
      alert(`Could not delete room: ${error.message}`);
    }
  });
}


/* =========================================================
   STUDENT FORM SUBMISSION
   ========================================================= */

if (studentForm) {

  studentForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!validateStudentForm()) return;

    const body = {
      studentId: document.getElementById("studentId").value.trim(),
      name:      document.getElementById("studentName").value.trim(),
      course:    document.getElementById("studentCourse").value.trim(),
      subject:   document.getElementById("studentSubject").value.trim(),
      section:   document.getElementById("studentSection").value.trim()
    };

    try {

      const data = await apiPost("/api/students", body);

      /* Add to cache */
      _students.push(normaliseId(data.student));

      studentForm.reset();
      clearStudentErrors();

      showTeacherView("students");
      renderStudents();
      updateDashboardStats();

    } catch (error) {
      document.getElementById("studentFormMessage").textContent =
        `Error: ${error.message}`;
    }
  });
}


/* =========================================================
   CANCEL STUDENT CREATION
   ========================================================= */

function cancelStudentCreation() {
  studentForm.reset();
  clearStudentErrors();
  showTeacherView("students");
}

const cancelStudent    = document.getElementById("cancelStudent");
const cancelStudentTop = document.getElementById("cancelStudentTop");
if (cancelStudent)    cancelStudent.addEventListener("click", cancelStudentCreation);
if (cancelStudentTop) cancelStudentTop.addEventListener("click", cancelStudentCreation);


/* =========================================================
   DELETE STUDENT
   ========================================================= */

if (studentList) {

  studentList.addEventListener("click", async (event) => {

    const button = event.target.closest(".student-delete-button");
    if (!button) return;

    const studentId = button.dataset.studentId;

    try {

      await apiDelete(`/api/students/${studentId}`);

      /* Remove from cache */
      _students = _students.filter((s) => s.id !== studentId);

      renderStudents(studentSearch ? studentSearch.value : "");
      updateDashboardStats();

    } catch (error) {
      alert(`Could not delete student: ${error.message}`);
    }
  });
}


/* =========================================================
   STUDENT SEARCH
   ========================================================= */

if (studentSearch) {
  studentSearch.addEventListener("input", () => renderStudents(studentSearch.value));
}


/* =========================================================
   JSON STUDENT IMPORT
   ========================================================= */

const studentJsonFile = document.getElementById("studentJsonFile");

if (studentJsonFile) {

  studentJsonFile.addEventListener("change", function (event) {

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async function () {

      try {

        const importedStudents = JSON.parse(reader.result);

        if (!Array.isArray(importedStudents)) {
          alert("The JSON file must contain an array of students.");
          return;
        }

        const validStudents = importedStudents.filter(
          (s) => s && s.name && (s.rollNo || s.studentId) && s.subject && s.section
        );

        if (validStudents.length !== importedStudents.length) {
          alert("Some students were skipped because required fields are missing.");
        }

        const data = await apiPost("/api/students/import", { students: validStudents });

        /* Add imported students to cache */
        const imported = Array.isArray(data.students)
          ? data.students.map(normaliseId)
          : [];

        _students = _students.concat(imported);

        alert(
          `${imported.length} student${imported.length === 1 ? "" : "s"} imported successfully.`
        );

        event.target.value = "";
        renderStudents();
        updateDashboardStats();

      } catch (error) {
        alert(`Import failed: ${error.message}`);
      }
    };

    reader.readAsText(file);
  });
}


/* =========================================================
   SEATING PLAN HELPERS  (pure functions, no storage calls)
   ========================================================= */

function getRoomCapacity(room) {
  if (Number(room.capacity) > 0) return Number(room.capacity);
  if (room.type === "standard")  return Number(room.rows) * Number(room.columns);
  return Number(room.rows) * Number(room.benchesPerRow) * Number(room.studentsPerBench || 2);
}

function getSelectedRoomsForExam(exam) {
  const roomIds = Array.isArray(exam.roomIds) ? exam.roomIds : [];
  return roomIds.map((id) => _rooms.find((r) => r.id === id)).filter(Boolean);
}

function escapeSeatingHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setSeatingMessage(message, type = "") {
  if (!seatingCapacityMessage) return;
  seatingCapacityMessage.textContent = message;
  seatingCapacityMessage.classList.toggle("success", type === "success");
  seatingCapacityMessage.classList.toggle("error",   type === "error");
}


/* =========================================================
   SEATING — SUMMARY / CONTROLS
   ========================================================= */

function updateSeatingSummary(exam) {

  if (!exam) {
    if (seatingStudentCount) seatingStudentCount.textContent = "0";
    if (seatingRoomCount)    seatingRoomCount.textContent    = "0";
    if (seatingCapacity)     seatingCapacity.textContent     = "0";
    setSeatingMessage("Select an examination to check seating capacity.");
    return;
  }

  const students      = Array.isArray(exam.studentIds) ? exam.studentIds : [];
  const rooms         = getSelectedRoomsForExam(exam);
  const totalCapacity = rooms.reduce((total, room) => total + getRoomCapacity(room), 0);

  if (seatingStudentCount) seatingStudentCount.textContent = students.length;
  if (seatingRoomCount)    seatingRoomCount.textContent    = rooms.length;
  if (seatingCapacity)     seatingCapacity.textContent     = totalCapacity;

  if (students.length === 0) { setSeatingMessage("No students are assigned to this examination.", "error"); return; }
  if (rooms.length === 0)    { setSeatingMessage("No rooms are assigned to this examination.",    "error"); return; }

  if (totalCapacity < students.length) {
    setSeatingMessage(
      `Not enough seating capacity. ${students.length} students need seats, but only ${totalCapacity} seats are available.`,
      "error"
    );
    return;
  }

  setSeatingMessage(
    `Capacity is sufficient. ${students.length} students can be seated across ${rooms.length} room${rooms.length === 1 ? "" : "s"}.`,
    "success"
  );
}

function updateSeatingPlanControls(exam) {

  const plan     = exam ? getSeatingPlanForExam(exam.id) : null;
  const students = exam && Array.isArray(exam.studentIds) ? exam.studentIds.length : 0;
  const rooms    = exam ? getSelectedRoomsForExam(exam) : [];
  const capacity = rooms.reduce((total, room) => total + getRoomCapacity(room), 0);

  const canGenerate  = Boolean(exam && students > 0 && rooms.length > 0 && capacity >= students);
  const isFinalized  = Boolean(plan && plan.status === "Finalized");
  const hasPlan      = Boolean(plan);

  if (generateSeatingButton) {
    generateSeatingButton.hidden   = hasPlan;
    generateSeatingButton.disabled = !canGenerate || hasPlan;
  }

  if (seatingRegenerateButton) {
    seatingRegenerateButton.hidden = !hasPlan || isFinalized;
  }

  if (finalizeSeatingButton) {

    let canFinalize = Boolean(plan && !isFinalized);

    if (plan && exam) {
      const conflicts = checkSeatingPlanConflicts(plan, exam);
      const assignedCount = new Set(
        Array.isArray(plan.assignments)
          ? plan.assignments.map((a) => a.studentId).filter(Boolean)
          : []
      ).size;
      const expectedCount = Array.isArray(exam.studentIds) ? exam.studentIds.length : 0;
      if (conflicts.length > 0 || assignedCount < expectedCount) canFinalize = false;
    }

    finalizeSeatingButton.hidden   = !hasPlan || isFinalized;
    finalizeSeatingButton.disabled = !canFinalize;
  }

  if (seatingPlanStatusBadge) {
    const status = plan ? plan.status : "Draft";
    seatingPlanStatusBadge.textContent = status;
    seatingPlanStatusBadge.className   = "seating-status-badge";
    if (status === "Generated") seatingPlanStatusBadge.classList.add("generated");
    if (status === "Finalized") seatingPlanStatusBadge.classList.add("finalized");
  }
}

function populateSeatingExamSelect() {

  if (!seatingExamSelect) return;

  const examinations = getExaminations();
  const currentValue = seatingExamSelect.value;

  seatingExamSelect.innerHTML =
    `<option value="">Select an examination</option>`;

  examinations.forEach((exam) => {
    const option = document.createElement("option");
    option.value       = exam.id;
    option.textContent = `${exam.name} · ${exam.subject}`;
    seatingExamSelect.appendChild(option);
  });

  if (examinations.some((e) => e.id === currentValue)) {
    seatingExamSelect.value = currentValue;
  }
}

function renderSeatingPlansPage() {

  if (!seatingExamSelect) return;

  populateSeatingExamSelect();

  if (!seatingExamSelect.value) {
    const savedPlans = getSeatingPlans();
    if (savedPlans.length > 0) {
      const latest = savedPlans[savedPlans.length - 1];
      if (getExaminationById(latest.examId)) {
        seatingExamSelect.value = latest.examId;
      }
    }
  }

  const examId = seatingExamSelect.value;
  const exam   = examId ? getExaminationById(examId) : null;

  updateSeatingSummary(exam);
  updateSeatingPlanControls(exam);

  if (!exam) {
    seatingPlanPreview.hidden = true;
    seatingPlanEmpty.hidden   = false;
    return;
  }

  const plan = getSeatingPlanForExam(exam.id);

  if (!plan) {
    seatingPlanPreview.hidden = true;
    seatingPlanEmpty.hidden   = false;
    return;
  }

  seatingPlanEmpty.hidden   = false;
  seatingPlanPreview.hidden = false;
  renderGeneratedSeatingPlan(plan, exam);
}


/* =========================================================
   SEATING — EXAM SELECT CHANGE
   ========================================================= */

if (seatingExamSelect) {

  seatingExamSelect.addEventListener("change", () => {

    const exam = getExaminationById(seatingExamSelect.value);

    if (seatingPlanMessage) seatingPlanMessage.textContent = "";

    updateSeatingSummary(exam);
    updateSeatingPlanControls(exam);

    const plan = exam ? getSeatingPlanForExam(exam.id) : null;

    if (plan) {
      seatingPlanEmpty.hidden   = true;
      seatingPlanPreview.hidden = false;
      renderGeneratedSeatingPlan(plan, exam);
    } else {
      seatingPlanEmpty.hidden   = false;
      seatingPlanPreview.hidden = true;
    }
  });
}


/* =========================================================
   SEATING — GENERATE
   ========================================================= */

async function generateSeatingPlan() {

  if (!seatingExamSelect) return;

  const examId = seatingExamSelect.value;
  if (!examId) {
    if (seatingPlanMessage) seatingPlanMessage.textContent = "Please select an examination first.";
    return;
  }

  const exam = getExaminationById(examId);
  if (!exam) return;

  const students = getStudents().filter(
    (s) => Array.isArray(exam.studentIds) && exam.studentIds.includes(s.id)
  );

  const rooms         = getSelectedRoomsForExam(exam);
  const totalCapacity = rooms.reduce((total, room) => total + getRoomCapacity(room), 0);

  if (students.length === 0) { setSeatingMessage("Cannot generate the plan because no students are assigned.", "error"); return; }
  if (rooms.length === 0)    { setSeatingMessage("Cannot generate the plan because no rooms are assigned.",    "error"); return; }
  if (totalCapacity < students.length) {
    setSeatingMessage(`Cannot generate the plan. ${students.length} students need seats, but only ${totalCapacity} are available.`, "error");
    return;
  }

  /* Run the algorithm (still in the browser) */
  const plan = ExamSeatSeatingAlgorithm.createPlan(exam, students, rooms);

  if (plan.unassignedStudentIds.length > 0) {
    setSeatingMessage("The plan could not place every assigned student.", "error");
    return;
  }

  /* Persist to MongoDB via the API */
  try {

    const data = await apiPost("/api/seating-plans", {
      ...plan,
      examId: exam.id
    });

    const saved = normaliseId(data.seatingPlan);

    /* Update cache: replace any existing plan for this exam */
    _seatingPlans = _seatingPlans.filter((p) => p.examId !== exam.id);
    _seatingPlans.push(saved);

    updateDashboardStats();
    renderExaminations();
    renderSeatingPlansPage();

    if (seatingPlanMessage) seatingPlanMessage.textContent = "Seating plan generated successfully.";

  } catch (error) {
    setSeatingMessage(`Failed to save plan: ${error.message}`, "error");
  }
}

if (generateSeatingButton)   generateSeatingButton.addEventListener("click",   generateSeatingPlan);
if (seatingRegenerateButton) seatingRegenerateButton.addEventListener("click", generateSeatingPlan);
if (printSeatingButton)      printSeatingButton.addEventListener("click",      printSeatingPlan);


/* =========================================================
   SEATING — CONFLICT CHECKER  (pure, no storage)
   ========================================================= */

function checkSeatingPlanConflicts(plan, exam) {

  const conflicts = [];
  if (!plan || !exam) return conflicts;

  const expectedStudentIds = Array.isArray(exam.studentIds)  ? exam.studentIds  : [];
  const selectedRoomIds    = Array.isArray(exam.roomIds)      ? exam.roomIds      : [];
  const assignments        = Array.isArray(plan.assignments)  ? plan.assignments  : [];

  /* 1. Duplicate students */
  const studentOccurrences = new Map();
  assignments.forEach((a) => {
    if (!a.studentId) return;
    studentOccurrences.set(a.studentId, (studentOccurrences.get(a.studentId) || 0) + 1);
  });
  studentOccurrences.forEach((count, studentId) => {
    if (count > 1) conflicts.push({ type: "duplicate-student", studentId, message: `Student ${studentId} has been assigned to ${count} seats.` });
  });

  /* 2. Missing students */
  const assignedStudentIds = new Set(assignments.map((a) => a.studentId));
  expectedStudentIds.forEach((sid) => {
    if (!assignedStudentIds.has(sid)) {
      conflicts.push({ type: "missing-student", studentId: sid, message: `Student ${sid} has not been assigned a seat.` });
    }
  });

  /* 3. Invalid rooms */
  assignments.forEach((a) => {
    if (!selectedRoomIds.includes(a.roomId)) {
      conflicts.push({ type: "invalid-room", roomId: a.roomId, studentId: a.studentId, message: `Student ${a.studentId} is assigned to a room not assigned to this examination.` });
    }
  });

  /* 4. Duplicate seats */
  const seatOccurrences = new Map();
  assignments.forEach((a) => {
    if (!a.roomId || !a.seat) return;
    const key = `${a.roomId}::${a.seat}`;
    seatOccurrences.set(key, (seatOccurrences.get(key) || 0) + 1);
  });
  seatOccurrences.forEach((count, key) => {
    if (count > 1) {
      const parts = key.split("::");
      conflicts.push({ type: "duplicate-seat", roomId: parts[0], seat: parts[1], message: `Seat ${parts[1]} in room ${parts[0]} is assigned to multiple students.` });
    }
  });

  /* 5. Room capacity */
  const roomAssignments = new Map();
  assignments.forEach((a) => {
    if (!a.roomId) return;
    roomAssignments.set(a.roomId, (roomAssignments.get(a.roomId) || 0) + 1);
  });
  getSelectedRoomsForExam(exam).forEach((room) => {
    const assigned = roomAssignments.get(room.id) || 0;
    const cap      = getRoomCapacity(room);
    if (assigned > cap) {
      conflicts.push({ type: "room-capacity", roomId: room.id, message: `${room.name} has ${assigned} students assigned but only ${cap} seats.` });
    }
  });

  /* 6. Section adjacency (Person A's constraint) */
  conflicts.push(
    ...ExamSeatSeatingAlgorithm.findSectionAdjacencyConflicts(
      plan, getStudents(), getSelectedRoomsForExam(exam)
    )
  );

  return conflicts;
}


/* =========================================================
   SEATING — RENDER GENERATED PLAN
   ========================================================= */

function renderGeneratedSeatingPlan(plan, exam) {

  const conflicts     = checkSeatingPlanConflicts(plan, exam);
  const assignments   = Array.isArray(plan.assignments) ? plan.assignments : [];
  const expectedIds   = Array.isArray(exam.studentIds)  ? exam.studentIds  : [];
  const assignedIds   = new Set(assignments.map((a) => a.studentId).filter(Boolean));

  const assignedCount   = assignedIds.size;
  const expectedCount   = expectedIds.length;
  const unassignedCount = Math.max(0, expectedCount - assignedCount);
  const roomsUsedCount  = Array.isArray(plan.rooms)
    ? plan.rooms.filter((r) => Array.isArray(r.assignments) && r.assignments.length > 0).length
    : 0;
  const conflictCount   = conflicts.length;

  if (seatingReviewPanel)          seatingReviewPanel.hidden = false;
  if (reviewAssignedStudents)      reviewAssignedStudents.textContent = `${assignedCount} / ${expectedCount}`;
  if (reviewRoomsUsed)             reviewRoomsUsed.textContent        = roomsUsedCount;
  if (reviewSeatsAvailable)        reviewSeatsAvailable.textContent   = plan.capacity || 0;
  if (reviewUnassignedStudents)    reviewUnassignedStudents.textContent = unassignedCount;
  if (reviewConflictCount)         reviewConflictCount.textContent    = conflictCount;

  const hasProblems = conflictCount > 0 || unassignedCount > 0 || assignedCount < expectedCount;

  if (seatingReviewStatus) {
    seatingReviewStatus.classList.toggle("warning", hasProblems);
    seatingReviewStatus.textContent = hasProblems ? "Conflicts detected" : "Ready for review";
  }

  if (seatingReviewMessage) {
    seatingReviewMessage.classList.toggle("warning", hasProblems);
    if (hasProblems) {
      const conflictText   = conflictCount > 0 ? `${conflictCount} conflict${conflictCount === 1 ? "" : "s"} detected` : "No conflicts detected";
      const unassignedText = unassignedCount > 0 ? ` ${unassignedCount} student${unassignedCount === 1 ? "" : "s"} unassigned.` : "";
      seatingReviewMessage.textContent = `⚠ ${conflictText}.${unassignedText} The plan cannot be finalized until it is valid.`;
    } else {
      seatingReviewMessage.textContent = "✓ Seating plan is valid and ready for review.";
    }
  }

  if (!seatingRoomList) return;

  if (seatingPreviewTitle) seatingPreviewTitle.textContent = exam.name;

  if (seatingPreviewMeta) {
    seatingPreviewMeta.textContent =
      `${exam.subject} · ${formatExamDate(exam.date)} · ${assignedCount} / ${expectedCount} students assigned · ${plan.capacity} available seats`;
  }

  seatingRoomList.innerHTML = "";

  plan.rooms.forEach((room) => {

    const card       = document.createElement("article");
    card.className   = "panel seating-room-card";
    const typeLabel  = room.type === "standard" ? "Standard Classroom" : "Bench Classroom";
    const cardHeader = document.createElement("div");
    cardHeader.className = "seating-room-header";

    cardHeader.innerHTML = `
      <div>
        <p class="eyebrow">${typeLabel}</p>
        <h3>${escapeSeatingHtml(room.roomName)}</h3>
        <p>${room.type === "standard"
          ? `${room.rows} rows × ${room.columns} columns`
          : `${room.rows} rows × ${room.benchesPerRow} benches · 2 students per bench`}
        </p>
      </div>
      <span class="seating-room-count">${room.assignments.length} students</span>
    `;

    card.appendChild(cardHeader);

    const tableWrap = document.createElement("div");
    tableWrap.className = "seating-table-wrap";

    if (room.type === "standard") {

      const table   = document.createElement("table");
      table.className = "seating-table";

      let html = "<thead><tr><th>Row</th>";
      for (let col = 1; col <= room.columns; col++) html += `<th>Seat ${col}</th>`;
      html += "</tr></thead><tbody>";

      for (let row = 1; row <= room.rows; row++) {
        html += `<tr><th>Row ${row}</th>`;
        for (let col = 1; col <= room.columns; col++) {
          const assignment = room.assignments.find((a) => a.row === row && a.column === col);
          if (assignment) {
            const subject = String(assignment.subject || "").trim();
            const subjectClass = subject
              ? `seat-subject-${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
              : "seat-subject-unknown";
            html += `
              <td class="${subjectClass}">
                <span class="seat-assignment-name">${escapeSeatingHtml(assignment.studentName)}</span>
                <span class="seat-assignment-id">${escapeSeatingHtml(assignment.studentNumber)}</span>
              </td>`;
          } else {
            html += `<td><span class="seat-assignment-empty">Available</span></td>`;
          }
        }
        html += "</tr>";
      }
      html += "</tbody>";
      table.innerHTML = html;
      tableWrap.appendChild(table);

    } else {

      const table   = document.createElement("table");
      table.className = "seating-table";

      let html = "<thead><tr><th>Row</th>";
      for (let bench = 1; bench <= room.benchesPerRow; bench++) html += `<th>Bench ${bench}</th>`;
      html += "</tr></thead><tbody>";

      for (let row = 1; row <= room.rows; row++) {
        html += `<tr><th>Row ${row}</th>`;
        for (let bench = 1; bench <= room.benchesPerRow; bench++) {
          const first  = room.assignments.find((a) => a.row === row && a.bench === bench && a.position === 1);
          const second = room.assignments.find((a) => a.row === row && a.bench === bench && a.position === 2);
          html += `
            <td class="bench-seat-cell">
              <div class="bench-seat">
                <span>${first
                  ? `<span class="seat-assignment-name">${escapeSeatingHtml(first.studentName)}</span>
                     <span class="seat-assignment-id">${escapeSeatingHtml(first.studentNumber)}</span>`
                  : `<span class="seat-assignment-empty">Available</span>`}
                </span>
                <span>${second
                  ? `<span class="seat-assignment-name">${escapeSeatingHtml(second.studentName)}</span>
                     <span class="seat-assignment-id">${escapeSeatingHtml(second.studentNumber)}</span>`
                  : `<span class="seat-assignment-empty">Available</span>`}
                </span>
              </div>
            </td>`;
        }
        html += "</tr>";
      }
      html += "</tbody>";
      table.innerHTML = html;
      tableWrap.appendChild(table);
    }

    card.appendChild(tableWrap);

    const note = document.createElement("p");
    note.className   = "seating-plan-note";
    note.textContent = "Seats are assigned sequentially for this prototype. The final backend algorithm can replace this allocation later.";
    card.appendChild(note);

    seatingRoomList.appendChild(card);
  });
}


/* =========================================================
   SEATING — FINALIZE
   ========================================================= */

function finalizeSeatingPlan() {

  if (!seatingExamSelect) return;

  const examId = seatingExamSelect.value;
  const exam   = getExaminationById(examId);
  const plan   = getSeatingPlanForExam(examId);

  if (!exam || !plan) return;

  const conflicts    = checkSeatingPlanConflicts(plan, exam);
  const assignedIds  = new Set(
    Array.isArray(plan.assignments)
      ? plan.assignments.map((a) => a.studentId).filter(Boolean)
      : []
  );
  const expectedCount = Array.isArray(exam.studentIds) ? exam.studentIds.length : 0;

  if (conflicts.length > 0 || assignedIds.size < expectedCount || plan.status === "Finalized") return;

  /* Fill the confirmation modal */
  if (finalizeModalStudents) finalizeModalStudents.textContent = `${assignedIds.size} / ${expectedCount}`;

  if (finalizeModalRooms) {
    const roomsUsed = Array.isArray(plan.rooms)
      ? plan.rooms.filter((r) => Array.isArray(r.assignments) && r.assignments.length > 0).length
      : getSelectedRoomsForExam(exam).length;
    finalizeModalRooms.textContent = roomsUsed;
  }

  if (finalizeModalConflicts) finalizeModalConflicts.textContent = conflicts.length;

  if (finalizeModalBackdrop) finalizeModalBackdrop.hidden = false;
}

async function confirmFinalizeSeatingPlan() {

  if (!seatingExamSelect) return;

  const examId = seatingExamSelect.value;
  const exam   = getExaminationById(examId);
  const plan   = getSeatingPlanForExam(examId);

  if (!exam || !plan) return;

  const conflicts    = checkSeatingPlanConflicts(plan, exam);
  const assignedIds  = new Set(
    Array.isArray(plan.assignments)
      ? plan.assignments.map((a) => a.studentId).filter(Boolean)
      : []
  );
  const expectedCount = Array.isArray(exam.studentIds) ? exam.studentIds.length : 0;

  if (conflicts.length > 0 || assignedIds.size < expectedCount || plan.status === "Finalized") {
    closeFinalizeModal();
    return;
  }

  try {

    const data = await apiPut(`/api/seating-plans/${plan.id || plan._id}/finalize`, {});

    const updated = normaliseId(data.seatingPlan);

    /* Update cache */
    _seatingPlans = _seatingPlans.map((p) => (p.examId === examId ? updated : p));

    /* Also mark the exam status */
    _examinations = _examinations.map((e) => {
      if (e.id !== examId) return e;
      return { ...e, status: "Finalized", seatingPlanStatus: "Finalized" };
    });

    closeFinalizeModal();
    updateDashboardStats();
    renderExaminations();
    renderSeatingPlansPage();

  } catch (error) {
    closeFinalizeModal();
    alert(`Finalization failed: ${error.message}`);
  }
}

function closeFinalizeModal() {
  if (finalizeModalBackdrop) finalizeModalBackdrop.hidden = true;
}

if (finalizeSeatingButton)  finalizeSeatingButton.addEventListener("click",  finalizeSeatingPlan);
if (cancelFinalizeButton)   cancelFinalizeButton.addEventListener("click",   closeFinalizeModal);
if (confirmFinalizeButton)  confirmFinalizeButton.addEventListener("click",  confirmFinalizeSeatingPlan);

if (finalizeModalBackdrop) {
  finalizeModalBackdrop.addEventListener("click", (event) => {
    if (event.target === finalizeModalBackdrop) closeFinalizeModal();
  });
}


/* =========================================================
   PRINT
   ========================================================= */

function printSeatingPlan() {
  if (!seatingPlanPreview || seatingPlanPreview.hidden) {
    alert("Generate a seating plan before printing.");
    return;
  }
  window.print();
}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

const menuButton = document.getElementById("menuButton");

if (menuButton) {
  menuButton.addEventListener("click", () => {
    const open = teacherSidebar.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    teacherOverlay.hidden = !open;
  });
}

if (teacherOverlay) {
  teacherOverlay.addEventListener("click", () => {
    teacherSidebar.classList.remove("open");
    teacherOverlay.hidden = true;
  });
}


/* =========================================================
   BROWSER BACK / FORWARD
   ========================================================= */

window.addEventListener("popstate", () => {
  showTeacherView(window.location.hash.slice(1), false);
  updateDashboardStats();
});


/* =========================================================
   INITIAL PAGE LOAD
   Load all data from the API, then render.
   ========================================================= */

async function initTeacherPage() {

  try {
    await Promise.all([
      loadExaminations(),
      loadStudents(),
      loadRooms(),
      loadSeatingPlans()
    ]);
  } catch (error) {
    console.error("Failed to load data:", error);
  }

  updateDashboardStats();
  renderExaminations();
  renderRooms();
  renderStudents();
  populateSeatingExamSelect();

  showTeacherView(
    window.location.hash.slice(1),
    false
  );
}

initTeacherPage();


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutExamSeat() {
  localStorage.removeItem("examSeatToken");
  localStorage.removeItem("examSeatSession");
  window.location.replace("index.html");
}
