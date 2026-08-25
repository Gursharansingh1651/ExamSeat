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
  document.getElementById(
    "finalizeModalBackdrop"
  );

const cancelFinalizeButton =
  document.getElementById(
    "cancelFinalizeButton"
  );

const confirmFinalizeButton =
  document.getElementById(
    "confirmFinalizeButton"
  );

const finalizeModalStudents =
  document.getElementById(
    "finalizeModalStudents"
  );

const finalizeModalRooms =
  document.getElementById(
    "finalizeModalRooms"
  );

const finalizeModalConflicts =
  document.getElementById(
    "finalizeModalConflicts"
  );  

const seatingPlanPreview =
  document.getElementById("seatingPlanPreview");

const printSeatingButton =
  document.getElementById(
    "printSeatingButton"
  );

const seatingPlanEmpty =
  document.getElementById("seatingPlanEmpty");

const seatingPreviewTitle =
  document.getElementById("seatingPreviewTitle");

const seatingPreviewMeta =
  document.getElementById("seatingPreviewMeta");

const seatingRoomList =
  document.getElementById("seatingRoomList");

const seatingReviewPanel =
  document.getElementById(
    "seatingReviewPanel"
  );

const seatingReviewStatus =
  document.getElementById(
    "seatingReviewStatus"
  );

const reviewAssignedStudents =
  document.getElementById(
    "reviewAssignedStudents"
  );

const reviewRoomsUsed =
  document.getElementById(
    "reviewRoomsUsed"
  );

const reviewSeatsAvailable =
  document.getElementById(
    "reviewSeatsAvailable"
  );

const reviewUnassignedStudents =
  document.getElementById(
    "reviewUnassignedStudents"
  );

const reviewConflictCount =
  document.getElementById(
    "reviewConflictCount"
  );

const seatingReviewMessage =
  document.getElementById(
    "seatingReviewMessage"
  );  

const seatingPlansStorageKey =
  "examSeatSeatingPlans";  

const examinationStorageKey =
  "examSeatExaminations";


/* =========================================================
   ROOM ELEMENTS
   ========================================================= */

const roomForm =
  document.getElementById("roomForm");

const roomList =
  document.getElementById("roomList");

const roomEmpty =
  document.getElementById("roomEmpty");

const roomStorageKey =
  "examSeatRooms";

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

const studentStorageKey =
  "examSeatStudents";   


/* =========================================================
   EXAMINATION STORAGE
   ========================================================= */

function getExaminations() {
  try {
    const savedExaminations =
      JSON.parse(
        localStorage.getItem(examinationStorageKey)
      );

    return Array.isArray(savedExaminations)
      ? savedExaminations
      : [];

  } catch (error) {
    return [];
  }
}


function saveExaminations(examinations) {
  localStorage.setItem(
    examinationStorageKey,
    JSON.stringify(examinations)
  );
}

/* =========================================================
   SEATING PLAN STORAGE
   ========================================================= */

function getSeatingPlans() {

  try {

    const savedPlans =
      JSON.parse(
        localStorage.getItem(
          seatingPlansStorageKey
        )
      );

    return Array.isArray(savedPlans)
      ? savedPlans
      : [];

  } catch (error) {

    return [];
  }
}


function saveSeatingPlans(plans) {

  localStorage.setItem(
    seatingPlansStorageKey,
    JSON.stringify(plans)
  );
}


function getSeatingPlanForExam(
  examId
) {

  return getSeatingPlans().find(
    (plan) =>
      plan.examId === examId
  ) || null;
}


/* =========================================================
   EXAMINATION FORMATTING
   ========================================================= */

function formatExamDate(dateValue) {

  const date =
    new Date(`${dateValue}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? dateValue
    : date.toLocaleDateString(
        undefined,
        {
          day: "numeric",
          month: "short",
          year: "numeric"
        }
      );
}


function formatExamTime(timeValue) {

  if (!timeValue) {
    return "";
  }

  const [hours, minutes] =
    timeValue.split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString(
    [],
    {
      hour: "numeric",
      minute: "2-digit"
    }
  );
}


/* =========================================================
   RENDER EXAMINATIONS
   ========================================================= */

function renderExaminations() {

  if (!examinationList || !examinationEmpty) {
    return;
  }

  const examinations =
    getExaminations().sort(
      (first, second) =>
        `${first.date}${first.startTime}`
          .localeCompare(
            `${second.date}${second.startTime}`
          )
    );

  examinationList.innerHTML = "";

  examinationEmpty.hidden =
    examinations.length > 0;


  examinations.forEach((exam) => {

    const card =
      document.createElement("article");

    card.className =
      "examination-card panel";

    card.innerHTML = `
      <div class="examination-card-top">

        <div>
          <p class="eyebrow">
            ${exam.subject}
          </p>

          <h3>
            ${exam.name}
          </h3>
        </div>

        <span class="status-badge">
          ${exam.status}
        </span>

      </div>

      <div class="exam-meta">

        <span>
          <b>Date</b>
          ${formatExamDate(exam.date)}
        </span>

        <span>
          <b>Time</b>
          ${formatExamTime(exam.startTime)}
        </span>

        <span>
          <b>Duration</b>
          ${exam.duration}
        </span>

        <span>
          <b>Students</b>
          ${exam.studentCount}
        </span>

        <span>
          <b>Rooms</b>
          ${exam.roomCount}
        </span>

      </div>

    ${
  exam.description
    ? `<p class="exam-description">
         ${exam.description}
       </p>`
    : ""
}

<div class="examination-card-actions">

  <button
    class="button button-secondary examination-manage-students"
    type="button"
    data-exam-id="${exam.id}"
  >
    Manage Students
  </button>

  <button
    class="button button-secondary examination-manage-rooms"
    type="button"
    data-exam-id="${exam.id}"
  >
    Manage Rooms
  </button>

  <button
  class="button button-secondary examination-delete-button"
  type="button"
  data-exam-id="${exam.id}"
>
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

function getExaminationById(examId) {
  return getExaminations().find(
    (exam) => exam.id === examId
  ) || null;
}

function updateExamination(examination) {
  const examinations = getExaminations();

  const index = examinations.findIndex(
    (exam) => exam.id === examination.id
  );

  if (index === -1) {
    return;
  }

  examinations[index] = examination;

  saveExaminations(examinations);
}

function renderWorkspaceStudents(searchTerm = "") {

  if (
    !workspaceStudentList ||
    !activeWorkspaceExamId
  ) {
    return;
  }

  const exam =
    getExaminationById(
      activeWorkspaceExamId
    );

  const students =
    getStudents();

  if (!exam) {
    return;
  }

  const selectedIds =
    new Set(
      Array.isArray(exam.studentIds)
        ? exam.studentIds
        : []
    );

  const query =
    searchTerm
      .trim()
      .toLowerCase();

  const filteredStudents =
    students.filter((student) => {

      if (!query) {
        return true;
      }

      return (
        String(student.studentId)
          .toLowerCase()
          .includes(query)

        ||

        String(student.name)
          .toLowerCase()
          .includes(query)

        ||

        String(student.course)
          .toLowerCase()
          .includes(query)
      );
    });

  workspaceStudentList.innerHTML = "";

  if (workspaceStudentCount) {

    workspaceStudentCount.textContent =
      `${students.length} ${
        students.length === 1
          ? "student"
          : "students"
      }`;
  }

  if (workspaceSelectedCount) {

    workspaceSelectedCount.textContent =
      `${selectedIds.size} selected`;
  }

  /* NO STUDENTS */

  if (students.length === 0) {

    workspaceStudentEmpty.hidden =
      false;

    workspaceStudentList.hidden =
      true;

    workspaceSelectAll.disabled =
      true;

    workspaceSaveStudents.disabled =
      true;

    return;
  }

  workspaceStudentEmpty.hidden =
    true;

  workspaceStudentList.hidden =
    false;

  workspaceSelectAll.disabled =
    false;

  workspaceSaveStudents.disabled =
    false;

  /* SEARCH FOUND NOTHING */

  if (filteredStudents.length === 0) {

    workspaceStudentList.innerHTML = `
      <div class="workspace-no-results">
        No students match your search.
      </div>
    `;

    workspaceSelectAll.checked =
      false;

    workspaceSelectAll.indeterminate =
      false;

    return;
  }

  /* RENDER STUDENTS */

  filteredStudents.forEach(
    (student) => {

      const row =
        document.createElement(
          "label"
        );

      row.className =
        "workspace-student-row";

      row.innerHTML = `
        <input
          class="workspace-student-checkbox"
          type="checkbox"
          value="${student.id}"
          ${
            selectedIds.has(student.id)
              ? "checked"
              : ""
          }
        >

        <span class="workspace-student-main">

          <strong>
            ${student.name}
          </strong>

          <small>
            ${student.studentId}
            ·
            ${student.course}
            .
            ${student.subject || "-"}
            ${
              student.section
                ? ` · ${student.section}`
                : ""
            }
          </small>

        </span>
      `;

      workspaceStudentList.appendChild(
        row
      );
    }
  );

  updateWorkspaceSelectAllState();
}


function updateWorkspaceSelectAllState() {

  if (
    !workspaceSelectAll ||
    !workspaceStudentList
  ) {
    return;
  }

  const checkboxes = [
    ...workspaceStudentList.querySelectorAll(
      ".workspace-student-checkbox"
    )
  ];

  const checkedCount =
    checkboxes.filter(
      (checkbox) =>
        checkbox.checked
    ).length;

  workspaceSelectAll.checked =
    checkboxes.length > 0 &&
    checkedCount ===
      checkboxes.length;

  workspaceSelectAll.indeterminate =
    checkedCount > 0 &&
    checkedCount <
      checkboxes.length;
}


function openExaminationStudentWorkspace(
  examId
) {

  const exam =
    getExaminationById(
      examId
    );

  if (!exam) {
    return;
  }

  activeWorkspaceExamId =
    examId;

  if (workspaceExamName) {

    workspaceExamName.textContent =
      exam.name;
  }

  if (workspaceExamMeta) {

    workspaceExamMeta.textContent =
      `${exam.subject} · ${
        formatExamDate(
          exam.date
        )
      } · ${
        formatExamTime(
          exam.startTime
        )
      } · ${
        exam.duration
      }`;
  }

  if (workspaceStudentSearch) {

    workspaceStudentSearch.value =
      "";
  }

  if (workspaceSaveMessage) {

    workspaceSaveMessage.textContent =
      "";
  }

  renderWorkspaceStudents();

  showTeacherView(
    "examination-workspace"
  );
}


function saveWorkspaceStudents() {

  if (
    !activeWorkspaceExamId ||
    !workspaceStudentList
  ) {
    return;
  }

  const exam =
    getExaminationById(
      activeWorkspaceExamId
    );

  if (!exam) {
    return;
  }

  const selectedIds = [
    ...workspaceStudentList.querySelectorAll(
      ".workspace-student-checkbox:checked"
    )
  ].map(
    (checkbox) =>
      checkbox.value
  );

  exam.studentIds =
    selectedIds;

  exam.studentCount =
    selectedIds.length;

  updateExamination(
    exam
  );

  renderExaminations();

  renderWorkspaceStudents(
    workspaceStudentSearch
      ? workspaceStudentSearch.value
      : ""
  );

  if (workspaceSaveMessage) {

    workspaceSaveMessage.textContent =
      `${
        selectedIds.length
      } ${
        selectedIds.length === 1
          ? "student has"
          : "students have"
      } been assigned to this examination.`;
  }
}


/* =========================================================
   ROOM STORAGE
   ========================================================= */

function getRooms() {

  try {

    const savedRooms =
      JSON.parse(
        localStorage.getItem(roomStorageKey)
      );

    return Array.isArray(savedRooms)
      ? savedRooms
      : [];

  } catch (error) {

    return [];
  }
}


function saveRooms(rooms) {

  localStorage.setItem(
    roomStorageKey,
    JSON.stringify(rooms)
  );
}

/* =========================================================
   STUDENT STORAGE
   ========================================================= */

function getStudents() {

  try {

    const savedStudents =
      JSON.parse(
        localStorage.getItem(studentStorageKey)
      );

    return Array.isArray(savedStudents)
      ? savedStudents
      : [];

  } catch (error) {

    return [];
  }
}

/* =========================================================
   REAL-TIME DASHBOARD STATISTICS
   ========================================================= */

function updateDashboardStats() {
  const students = getStudents();
  const rooms = getRooms();
  const seatingPlans = getSeatingPlans();

  // Students
  const studentCount =
    document.getElementById("dashboardStudentCount");

  if (studentCount) {
    studentCount.textContent = students.length;
  }

  // Rooms
  const roomCount =
    document.getElementById("dashboardRoomCount");

  if (roomCount) {
    roomCount.textContent = rooms.length;
  }

  // Total room capacity
  let totalSeats = 0;

  rooms.forEach((room) => {
    if (room.type === "standard") {
      totalSeats +=
        Number(room.rows || 0) *
        Number(room.columns || 0);
    } else if (room.type === "bench") {
      totalSeats +=
        Number(room.rows || 0) *
        Number(room.benchesPerRow || 0) *
        Number(room.studentsPerBench || 0);
    } else {
      totalSeats += Number(room.capacity || 0);
    }
  });

  // Seats currently assigned
  let assignedSeats = 0;

  if (Array.isArray(seatingPlans)) {
    seatingPlans.forEach((plan) => {
      if (Array.isArray(plan.assignments)) {
        assignedSeats += plan.assignments.length;
      }
    });
  }

  const availableSeats =
    Math.max(totalSeats - assignedSeats, 0);

  const availableSeatsElement =
    document.getElementById("dashboardAvailableSeats");

  if (availableSeatsElement) {
    availableSeatsElement.textContent = availableSeats;
  }

  // Conflicts
  let conflictCount = 0;

  if (Array.isArray(seatingPlans)) {
    seatingPlans.forEach((plan) => {
      if (Array.isArray(plan.conflicts)) {
        conflictCount += plan.conflicts.length;
      }
    });
  }

  const conflictElement =
    document.getElementById("dashboardConflictCount");

  if (conflictElement) {
    conflictElement.textContent = conflictCount;
  }
}


function saveStudents(students) {

  localStorage.setItem(
    studentStorageKey,
    JSON.stringify(students)
  );
}


/* =========================================================
   RENDER ROOMS
   ========================================================= */

function renderRooms() {

  if (!roomList || !roomEmpty) {
    return;
  }

  const rooms = getRooms();

  roomList.innerHTML = "";

  roomEmpty.hidden =
    rooms.length > 0;


  rooms.forEach((room) => {

    const card =
      document.createElement("article");

    card.className =
      "room-card panel";


    let roomTypeLabel = "";
    let configurationText = "";


    if (room.type === "standard") {

      roomTypeLabel =
        "Standard Classroom";

      configurationText =
        `${room.rows} rows × ${room.columns} columns`;

    } else {

      roomTypeLabel =
        "Bench Classroom";

      configurationText =
        `${room.rows} rows × ${room.benchesPerRow} benches`;
    }


    card.innerHTML = `

      <div class="room-card-top">

        <div>

          <p class="eyebrow">
            ${roomTypeLabel}
          </p>

          <h3>
            ${room.name}
          </h3>

        </div>

        <span class="status-badge">
          ${room.capacity} seats
        </span>

      </div>


      <div class="room-meta">

        <span>

          <b>Configuration</b>

          ${configurationText}

        </span>


        <span>

          <b>Capacity</b>

          ${room.capacity} students

        </span>


        ${
          room.type === "bench"

            ? `
              <span>

                <b>Students / Bench</b>

                2

              </span>
            `

            : ""
        }

      </div>


      <div class="room-card-actions">

        <button
          class="text-button room-delete-button"
          type="button"
          data-room-id="${room.id}"
        >
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

  if (!studentList) {
    return;
  }

  const students =
    getStudents();

  const query =
    searchTerm
      .trim()
      .toLowerCase();


  const filteredStudents =
    students.filter((student) => {

      if (!query) {
        return true;
      }

      return (
        student.studentId
          .toLowerCase()
          .includes(query)
        ||
        student.name
          .toLowerCase()
          .includes(query)
      );
    });


  studentList.innerHTML = "";


  if (studentCount) {

    studentCount.textContent =
      `${students.length} ${
        students.length === 1
          ? "student"
          : "students"
      }`;
  }


  /* No students at all */

  if (students.length === 0) {

    studentEmpty.hidden =
      false;

    studentNoResults.hidden =
      true;

    return;
  }


  studentEmpty.hidden =
    true;


  /* Students exist but search found nothing */

  if (filteredStudents.length === 0) {

    studentNoResults.hidden =
      false;

    return;
  }


  studentNoResults.hidden =
    true;


  filteredStudents.forEach(
    (student) => {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "student-card panel";


      card.innerHTML = `

        <div class="student-card-top">

          <div>

            <p class="eyebrow">
              Candidate
            </p>

            <h3>
              ${student.name}
            </h3>

          </div>

          <span class="student-id-badge">
            ID: ${student.studentId}
          </span>

        </div>


        <div class="student-meta">

          <span>
            <b>Course / Class</b>
            ${student.course}
          </span>

          <span>
            <b>Subject</b>
            ${student.subject || "-"}
          </span>


          ${
            student.section
              ? `
                <span>
                  <b>Section</b>
                  ${student.section}
                </span>
              `
              : ""
          }

        </div>


        <div class="student-card-actions">

          <button
            class="text-button student-delete-button"
            type="button"
            data-student-id="${student.id}"
          >
            Delete
          </button>

        </div>

      `;


      studentList.appendChild(
        card
      );
    }
  );
}


/* =========================================================
   ROOM TYPE UI
   ========================================================= */

function updateRoomTypeUI() {

  if (!roomType) {
    return;
  }

  const selectedType =
    roomType.value;


  if (standardRoomConfig) {

    standardRoomConfig.hidden =
      selectedType !== "standard";
  }


  if (benchRoomConfig) {

    benchRoomConfig.hidden =
      selectedType !== "bench";
  }


  if (roomCapacityPreview) {

    roomCapacityPreview.hidden =
      true;
  }


  if (roomCapacity) {

    roomCapacity.textContent =
      "0";
  }


  if (roomFormMessage) {

    roomFormMessage.textContent =
      "";
  }
}


/* =========================================================
   ROOM CAPACITY CALCULATION
   ========================================================= */

function updateRoomCapacity() {

  if (!roomType) {
    return;
  }

  let capacity = 0;


  /* STANDARD CLASSROOM */

  if (roomType.value === "standard") {

    const rows =
      Number(
        document.getElementById("roomRows").value
      );

    const columns =
      Number(
        document.getElementById("roomColumns").value
      );


    if (rows > 0 && columns > 0) {

      capacity =
        rows * columns;
    }
  }


  /* BENCH CLASSROOM */

  else if (roomType.value === "bench") {

    const rows =
      Number(
        document.getElementById("benchRows").value
      );

    const benches =
      Number(
        document.getElementById("benchesPerRow").value
      );


    if (rows > 0 && benches > 0) {

      const studentsPerBench = 2;

      capacity =
        rows *
        benches *
        studentsPerBench;
    }
  }


  if (roomCapacity) {

    roomCapacity.textContent =
      capacity;
  }


  if (roomCapacityPreview) {

    roomCapacityPreview.hidden =
      capacity <= 0;
  }
}


/* =========================================================
   ROOM FORM ERRORS
   ========================================================= */

function clearRoomErrors() {

  const fields = [
    "Name",
    "Type",
    "Rows",
    "Columns",
    "BenchRows",
    "BenchesPerRow"
  ];


  fields.forEach((field) => {

    const error =
      document.getElementById(
        `room${field}Error`
      );

    if (error) {

      error.textContent =
        "";
    }
  });


  if (roomFormMessage) {

    roomFormMessage.textContent =
      "";
  }
}


/* =========================================================
   ROOM VALIDATION
   ========================================================= */

function validateRoomForm() {

  clearRoomErrors();

  let valid = true;


  /* ROOM NAME */

  const nameInput =
    document.getElementById("roomName");


  if (!nameInput.value.trim()) {

    document.getElementById(
      "roomNameError"
    ).textContent =
      "Room name is required.";

    nameInput.setAttribute(
      "aria-invalid",
      "true"
    );

    valid = false;

  } else {

    nameInput.removeAttribute(
      "aria-invalid"
    );
  }


  /* ROOM TYPE */

  if (!roomType.value) {

    document.getElementById(
      "roomTypeError"
    ).textContent =
      "Please select a room type.";

    valid = false;
  }


  /* STANDARD CLASSROOM */

  if (
    roomType.value ===
    "standard"
  ) {

    const rows =
      Number(
        document.getElementById(
          "roomRows"
        ).value
      );

    const columns =
      Number(
        document.getElementById(
          "roomColumns"
        ).value
      );


    if (rows <= 0) {

      document.getElementById(
        "roomRowsError"
      ).textContent =
        "Enter a valid number of rows.";

      valid = false;
    }


    if (columns <= 0) {

      document.getElementById(
        "roomColumnsError"
      ).textContent =
        "Enter a valid number of columns.";

      valid = false;
    }
  }


  /* BENCH CLASSROOM */

  if (
    roomType.value ===
    "bench"
  ) {

    const rows =
      Number(
        document.getElementById(
          "benchRows"
        ).value
      );

    const benches =
      Number(
        document.getElementById(
          "benchesPerRow"
        ).value
      );


    if (rows <= 0) {

      document.getElementById(
        "benchRowsError"
      ).textContent =
        "Enter a valid number of rows.";

      valid = false;
    }


    if (benches <= 0) {

      document.getElementById(
        "benchesPerRowError"
      ).textContent =
        "Enter a valid number of benches.";

      valid = false;
    }
  }


  if (!valid && roomFormMessage) {

    roomFormMessage.textContent =
      "Please correct the highlighted fields.";
  }


  return valid;
}

/* =========================================================
   STUDENT VALIDATION
   ========================================================= */

function clearStudentErrors() {

  const fields = [
    "studentId",
    "studentName",
    "studentCourse"
  ];


  fields.forEach((id) => {

    const input =
      document.getElementById(id);

    const error =
      document.getElementById(
        `${id}Error`
      );


    if (input) {

      input.removeAttribute(
        "aria-invalid"
      );
    }


    if (error) {

      error.textContent =
        "";
    }
  });


  document.getElementById(
    "studentFormMessage"
  ).textContent =
    "";
}


function validateStudentForm() {

  clearStudentErrors();

  let valid = true;


  const studentId =
    document.getElementById(
      "studentId"
    );

  const studentName =
    document.getElementById(
      "studentName"
    );

  const studentCourse =
    document.getElementById(
      "studentCourse"
    );


  if (!studentId.value.trim()) {

    document.getElementById(
      "studentIdError"
    ).textContent =
      "Student ID is required.";

    studentId.setAttribute(
      "aria-invalid",
      "true"
    );

    valid = false;
  }


  if (!studentName.value.trim()) {

    document.getElementById(
      "studentNameError"
    ).textContent =
      "Student name is required.";

    studentName.setAttribute(
      "aria-invalid",
      "true"
    );

    valid = false;
  }


  if (!studentCourse.value.trim()) {

    document.getElementById(
      "studentCourseError"
    ).textContent =
      "Course / Class is required.";

    studentCourse.setAttribute(
      "aria-invalid",
      "true"
    );

    valid = false;
  }


  /* Prevent duplicate student IDs */

  const existingStudents =
    getStudents();

  const duplicate =
    existingStudents.some(
      (student) =>
        student.studentId
          .toLowerCase()
          ===
        studentId.value
          .trim()
          .toLowerCase()
    );


  if (duplicate) {

    document.getElementById(
      "studentIdError"
    ).textContent =
      "This Student ID already exists.";

    studentId.setAttribute(
      "aria-invalid",
      "true"
    );

    valid = false;
  }


  if (!valid) {

    document.getElementById(
      "studentFormMessage"
    ).textContent =
      "Please correct the highlighted fields.";
  }


  return valid;
}


/* =========================================================
   TEACHER VIEW SWITCHING
   ========================================================= */

function showTeacherView(
  viewId,
  updateHash = true
) {

  const view =
    document.getElementById(viewId) ||
    document.getElementById("dashboard");


  teacherViews.forEach((item) => {

    const active =
      item === view;

    item.hidden =
      !active;

    item.classList.toggle(
      "active",
      active
    );
  });


  teacherLinks.forEach((link) => {

    link.classList.toggle(
      "active",
      link.dataset.view === view.id
    );
  });


  teacherTitle.textContent =
    view.dataset.title;


  /* REFRESH PAGE DATA */

  if (
    view.id ===
    "examinations"
  ) {

    renderExaminations();
  }


  if (
    view.id ===
    "rooms"
  ) {

    renderRooms();
  }


  if (view.id === 
    "students"
  ) {
    renderStudents();
  }

  if (
  view.id ===
  "examination-workspace"
) {

  renderWorkspaceStudents(
    workspaceStudentSearch
      ? workspaceStudentSearch.value
      : ""
  );
}

if (
  view.id ===
  "examination-room-workspace"
) {

  renderWorkspaceRooms(
    workspaceRoomSearch
      ? workspaceRoomSearch.value
      : ""
  );
}

if (
  view.id ===
  "seating-plans"
) {

  renderSeatingPlansPage();
}

  /* UPDATE URL */

  if (updateHash) {

    history.pushState(
      {
        view: view.id
      },
      "",
      `#${view.id}`
    );
  }


  /* CLOSE MOBILE SIDEBAR */

  teacherSidebar.classList.remove(
    "open"
  );

  teacherOverlay.hidden =
    true;
}


/* =========================================================
   EXAMINATION FORM ERRORS
   ========================================================= */

function clearFieldErrors() {

  [
    "Name",
    "Subject",
    "Date",
    "StartTime",
    "Duration"
  ].forEach((field) => {

    const error =
      document.getElementById(
        `exam${field}Error`
      );

    const input =
      document.getElementById(
        `exam${field}`
      );


    if (error) {

      error.textContent =
        "";
    }


    if (input) {

      input.removeAttribute(
        "aria-invalid"
      );
    }
  });


  document.getElementById(
    "examFormMessage"
  ).textContent =
    "";
}


/* =========================================================
   EXAMINATION VALIDATION
   ========================================================= */

function validateExaminationForm() {

  const fields = [

    {
      id: "examName",
      label: "Examination name"
    },

    {
      id: "examSubject",
      label: "Subject"
    },

    {
      id: "examDate",
      label: "Date"
    },

    {
      id: "examStartTime",
      label: "Start time"
    },

    {
      id: "examDuration",
      label: "Duration"
    }

  ];


  clearFieldErrors();

  let valid = true;


  fields.forEach((field) => {

    const input =
      document.getElementById(
        field.id
      );


    if (!input.value.trim()) {

      document.getElementById(
        `${field.id}Error`
      ).textContent =
        `${field.label} is required.`;


      input.setAttribute(
        "aria-invalid",
        "true"
      );


      valid = false;
    }
  });


  if (!valid) {

    document.getElementById(
      "examFormMessage"
    ).textContent =
      "Please correct the highlighted fields before creating the examination.";
  }


  return valid;
}


/* =========================================================
   NAVIGATION LINKS
   ========================================================= */

teacherLinks.forEach((link) => {

  link.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      showTeacherView(
        link.dataset.view
      );
    }
  );
});


/* =========================================================
   BUTTONS WITH data-go-to
   ========================================================= */

document
  .querySelectorAll("[data-go-to]")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        showTeacherView(
          button.dataset.goTo
        );
      }
    );
  });


/* =========================================================
   EXAMINATION SUBMISSION
   ========================================================= */

if (examinationForm) {

  examinationForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      if (
        !validateExaminationForm()
      ) {

        return;
      }


      const examination = {

        id:
          `exam-${Date.now()}`,

        name:
          document
            .getElementById(
              "examName"
            )
            .value
            .trim(),

        subject:
          document
            .getElementById(
              "examSubject"
            )
            .value
            .trim(),

        date:
          document
            .getElementById(
              "examDate"
            )
            .value,

        startTime:
          document
            .getElementById(
              "examStartTime"
            )
            .value,

        duration:
          document
            .getElementById(
              "examDuration"
            )
            .value
            .trim(),

        description:
          document
            .getElementById(
              "examDescription"
            )
            .value
            .trim(),

      studentCount: 0,

      studentIds: [],

      roomIds: [],

      roomCount: 0,

      status: "Draft"
      };


      const examinations =
        getExaminations();


      examinations.push(
        examination
      );


      saveExaminations(
        examinations
      );


      examinationForm.reset();

      clearFieldErrors();


      examinationSuccess.textContent =
        `“${examination.name}” was created as a draft.`;

      examinationSuccess.hidden =
        false;


      showTeacherView(
        "examinations"
      );
    }
  );
}


/* =========================================================
   CANCEL EXAMINATION CREATION
   ========================================================= */

function cancelExaminationCreation() {

  examinationForm.reset();

  clearFieldErrors();

  showTeacherView(
    "examinations"
  );
}


document
  .getElementById(
    "cancelCreate"
  )
  .addEventListener(
    "click",
    cancelExaminationCreation
  );


document
  .getElementById(
    "cancelCreateTop"
  )
  .addEventListener(
    "click",
    cancelExaminationCreation
  );


/* =========================================================
   EXAMINATION STUDENT WORKSPACE EVENTS
   ========================================================= */

if (examinationList) {

  examinationList.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          ".examination-manage-students"
        );

      if (!button) {
        return;
      }

      openExaminationStudentWorkspace(
        button.dataset.examId
      );
    }
  );
}


if (workspaceStudentSearch) {

  workspaceStudentSearch.addEventListener(
    "input",
    () => {

      renderWorkspaceStudents(
        workspaceStudentSearch.value
      );
    }
  );
}


if (workspaceSelectAll) {

  workspaceSelectAll.addEventListener(
    "change",
    () => {

      const checkboxes = [
        ...workspaceStudentList.querySelectorAll(
          ".workspace-student-checkbox"
        )
      ];

      checkboxes.forEach(
        (checkbox) => {

          checkbox.checked =
            workspaceSelectAll.checked;
        }
      );

      updateWorkspaceSelectAllState();
    }
  );
}


if (workspaceStudentList) {

  workspaceStudentList.addEventListener(
    "change",
    (event) => {

      if (
        event.target.classList.contains(
          "workspace-student-checkbox"
        )
      ) {

        updateWorkspaceSelectAllState();
      }
    }
  );
}


if (workspaceSaveStudents) {

  workspaceSaveStudents.addEventListener(
    "click",
    saveWorkspaceStudents
  );
}  


/* =========================================================
   EXAMINATION ROOM WORKSPACE EVENTS
   ========================================================= */

if (examinationList) {

  examinationList.addEventListener(
    "click",
    (event) => {

      /* ================================
         MANAGE ROOMS
         ================================= */

      const roomButton =
        event.target.closest(
          ".examination-manage-rooms"
        );

      if (roomButton) {

        openExaminationRoomWorkspace(
          roomButton.dataset.examId
        );

        return;
      }


      /* ================================
         DELETE EXAMINATION
         ================================= */

      const deleteButton =
        event.target.closest(
          ".examination-delete-button"
        );

      if (!deleteButton) {
        return;
      }


      const examId =
        deleteButton.dataset.examId;

      const exam =
        getExaminationById(
          examId
        );

      if (!exam) {
        return;
      }


      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${exam.name}"?`
        );

      if (!confirmed) {
        return;
      }


      /* REMOVE EXAMINATION */

      const examinations =
        getExaminations()
          .filter(
            (item) =>
              item.id !== examId
          );

      saveExaminations(
        examinations
      );


      /* REMOVE RELATED SEATING PLAN */

      const seatingPlans =
        getSeatingPlans()
          .filter(
            (plan) =>
              plan.examId !== examId
          );

      saveSeatingPlans(
        seatingPlans
      );


      /* REFRESH EXAMINATION LIST */

      renderExaminations();


      /* REFRESH DASHBOARD */

      updateDashboardStats();

    }
  );
}


if (workspaceRoomSearch) {

  workspaceRoomSearch.addEventListener(
    "input",
    () => {

      renderWorkspaceRooms(
        workspaceRoomSearch.value
      );
    }
  );
}


if (workspaceRoomSelectAll) {

  workspaceRoomSelectAll.addEventListener(
    "change",
    () => {

      const checkboxes = [
        ...workspaceRoomList.querySelectorAll(
          ".workspace-room-checkbox"
        )
      ];

      checkboxes.forEach(
        (checkbox) => {

          checkbox.checked =
            workspaceRoomSelectAll.checked;
        }
      );

      updateWorkspaceRoomSelectAllState();
    }
  );
}


if (workspaceRoomList) {

  workspaceRoomList.addEventListener(
    "change",
    (event) => {

      if (
        event.target.classList.contains(
          "workspace-room-checkbox"
        )
      ) {

        updateWorkspaceRoomSelectAllState();
      }
    }
  );
}


if (workspaceSaveRooms) {

  workspaceSaveRooms.addEventListener(
    "click",
    saveWorkspaceRooms
  );
}

const studentJsonFile =
  document.getElementById(
    "studentJsonFile"
  );

/* JSON STUDENT IMPORT */

if (studentJsonFile) {

  studentJsonFile.addEventListener(
    "change",
    function (event) {

      const file =
        event.target.files[0];


      if (!file) {
        return;
      }


      const reader =
        new FileReader();


      reader.onload =
        function () {

          try {

            const importedStudents =
              JSON.parse(
                reader.result
              );


            if (
              !Array.isArray(
                importedStudents
              )
            ) {

              alert(
                "The JSON file must contain an array of students."
              );

              return;

            }


            const validStudents =
              importedStudents.filter(
                function (student) {

                  return (
                    student &&
                    student.name &&
                    (
                      student.rollNo ||
                      student.studentId
                    ) &&
                    student.subject &&
                    student.section
                  );

                }
              );


            if (
              validStudents.length !==
              importedStudents.length
            ) {

              alert(
                "Some students were skipped because required fields are missing."
              );

            }


            const existingStudents =
              getStudents();


            const studentsToSave =
              existingStudents.concat(
                validStudents.map(
                  function (student) {

                    return {

                      id:
                        student.id ||
                        `student-${Date.now()}-${Math.random()
                          .toString(36)
                          .slice(2, 8)}`,

                      name:
                        student.name,

                      studentId:
                        student.studentId ||
                        student.rollNo,

                      subject:
                        student.subject,

                      section:
                        student.section

                    };

                  }
                )
              );


            saveStudents(
              studentsToSave
            );


            alert(
              `${validStudents.length} student${
                validStudents.length === 1
                  ? ""
                  : "s"
              } imported successfully.`
            );


            event.target.value = "";


          } catch (error) {

            alert(
              "The selected file contains invalid JSON."
            );

          }

        };


      reader.readAsText(
        file
      );

    }
  );

}

function printSeatingPlan() {

  if (
    !seatingPlanPreview ||
    seatingPlanPreview.hidden
  ) {

    alert(
      "Generate a seating plan before printing."
    );

    return;

  }

  window.print();

}


/* =========================================================
   SEATING PLAN EVENTS
   ========================================================= */

if (seatingExamSelect) {

  seatingExamSelect.addEventListener(
    "change",
    () => {

      const exam =
        getExaminationById(
          seatingExamSelect.value
        );


      if (seatingPlanMessage) {

        seatingPlanMessage.textContent =
          "";
      }


      updateSeatingSummary(
        exam
      );

      updateSeatingPlanControls(
        exam
      );


      const plan =
        exam
          ? getSeatingPlanForExam(
              exam.id
            )
          : null;


      if (plan) {

        seatingPlanEmpty.hidden =
          true;

        seatingPlanPreview.hidden =
          false;

        renderGeneratedSeatingPlan(
          plan,
          exam
        );

      } else {

        seatingPlanEmpty.hidden =
          false;

        seatingPlanPreview.hidden =
          true;
      }
    }
  );
}


if (generateSeatingButton) {

  generateSeatingButton.addEventListener(
    "click",
    generateSeatingPlan
  );
}


if (seatingRegenerateButton) {

  seatingRegenerateButton.addEventListener(
    "click",
    generateSeatingPlan
  );
}

if (printSeatingButton) {

  printSeatingButton.addEventListener(
    "click",
    printSeatingPlan
  );

}


if (finalizeSeatingButton) {

  finalizeSeatingButton.addEventListener(
    "click",
    finalizeSeatingPlan
  );
}

if (cancelFinalizeButton) {

  cancelFinalizeButton.addEventListener(
    "click",
    closeFinalizeModal
  );
}


if (confirmFinalizeButton) {

  confirmFinalizeButton.addEventListener(
    "click",
    confirmFinalizeSeatingPlan
  );
}


if (finalizeModalBackdrop) {

  finalizeModalBackdrop.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        finalizeModalBackdrop
      ) {

        closeFinalizeModal();
      }
    }
  );
}

/* =========================================================
   EXAMINATION → ROOM WORKSPACE
   ========================================================= */

function renderWorkspaceRooms(searchTerm = "") {

  if (
    !workspaceRoomList ||
    !activeWorkspaceExamId
  ) {
    return;
  }

  const exam =
    getExaminationById(
      activeWorkspaceExamId
    );

  const rooms =
    getRooms();

  if (!exam) {
    return;
  }

  const selectedIds =
    new Set(
      Array.isArray(exam.roomIds)
        ? exam.roomIds
        : []
    );

  const query =
    searchTerm
      .trim()
      .toLowerCase();

  const filteredRooms =
    rooms.filter((room) => {

      if (!query) {
        return true;
      }

      return (
        String(room.name)
          .toLowerCase()
          .includes(query)

        ||

        String(room.type)
          .toLowerCase()
          .includes(query)
      );
    });

  workspaceRoomList.innerHTML = "";

  if (workspaceRoomCount) {

    workspaceRoomCount.textContent =
      `${rooms.length} ${
        rooms.length === 1
          ? "room"
          : "rooms"
      }`;
  }

  if (workspaceSelectedRoomCount) {

    workspaceSelectedRoomCount.textContent =
      `${selectedIds.size} selected`;
  }


  /* NO ROOMS */

  if (rooms.length === 0) {

    workspaceRoomEmpty.hidden =
      false;

    workspaceRoomList.hidden =
      true;

    workspaceRoomSelectAll.disabled =
      true;

    workspaceSaveRooms.disabled =
      true;

    return;
  }


  workspaceRoomEmpty.hidden =
    true;

  workspaceRoomList.hidden =
    false;

  workspaceRoomSelectAll.disabled =
    false;

  workspaceSaveRooms.disabled =
    false;


  /* SEARCH FOUND NOTHING */

  if (filteredRooms.length === 0) {

    workspaceRoomList.innerHTML = `
      <div class="workspace-no-results">
        No rooms match your search.
      </div>
    `;

    workspaceRoomSelectAll.checked =
      false;

    workspaceRoomSelectAll.indeterminate =
      false;

    return;
  }


  /* RENDER ROOMS */

  filteredRooms.forEach(
    (room) => {

      const row =
        document.createElement(
          "label"
        );

      row.className =
        "workspace-student-row";

      const roomTypeLabel =
        room.type === "standard"
          ? "Standard Classroom"
          : "Bench Classroom";

      const configuration =
        room.type === "standard"
          ? `${room.rows} rows × ${room.columns} columns`
          : `${room.rows} rows × ${room.benchesPerRow} benches`;

      row.innerHTML = `
        <input
          class="workspace-room-checkbox"
          type="checkbox"
          value="${room.id}"
          ${
            selectedIds.has(room.id)
              ? "checked"
              : ""
          }
        >

        <span class="workspace-student-main">

          <strong>
            ${room.name}
          </strong>

          <small>
            ${roomTypeLabel}
            ·
            ${configuration}
            ·
            ${room.capacity} seats
          </small>

        </span>
      `;

      workspaceRoomList.appendChild(
        row
      );
    }
  );

  updateWorkspaceRoomSelectAllState();
}


function updateWorkspaceRoomSelectAllState() {

  if (
    !workspaceRoomSelectAll ||
    !workspaceRoomList
  ) {
    return;
  }

  const checkboxes = [
    ...workspaceRoomList.querySelectorAll(
      ".workspace-room-checkbox"
    )
  ];

  const checkedCount =
    checkboxes.filter(
      (checkbox) =>
        checkbox.checked
    ).length;


  /* UPDATE SELECTED ROOM COUNT */

  if (workspaceSelectedRoomCount) {

    workspaceSelectedRoomCount.textContent =
      `${checkedCount} selected`;
  }


  /* UPDATE SELECT ALL */

  workspaceRoomSelectAll.checked =
    checkboxes.length > 0 &&
    checkedCount ===
      checkboxes.length;

  workspaceRoomSelectAll.indeterminate =
    checkedCount > 0 &&
    checkedCount <
      checkboxes.length;
}


function openExaminationRoomWorkspace(
  examId
) {

  const exam =
    getExaminationById(
      examId
    );

  if (!exam) {
    return;
  }

  activeWorkspaceExamId =
    examId;


  if (workspaceExamName) {

    workspaceExamName.textContent =
      exam.name;
  }


  if (workspaceExamMeta) {

    workspaceExamMeta.textContent =
      `${exam.subject} · ${
        formatExamDate(
          exam.date
        )
      } · ${
        formatExamTime(
          exam.startTime
        )
      } · ${
        exam.duration
      }`;
  }


  if (workspaceRoomSearch) {

    workspaceRoomSearch.value =
      "";
  }


  if (workspaceRoomSaveMessage) {

    workspaceRoomSaveMessage.textContent =
      "";
  }


  renderWorkspaceRooms();

  showTeacherView(
    "examination-room-workspace"
  );
}


function saveWorkspaceRooms() {

  if (
    !activeWorkspaceExamId ||
    !workspaceRoomList
  ) {
    return;
  }

  const exam =
    getExaminationById(
      activeWorkspaceExamId
    );

  if (!exam) {
    return;
  }


  const selectedIds = [
    ...workspaceRoomList.querySelectorAll(
      ".workspace-room-checkbox:checked"
    )
  ].map(
    (checkbox) =>
      checkbox.value
  );

    /* CHECK FOR ROOM TIME CONFLICTS */

  const proposedExam = {
    ...exam,
    roomIds: selectedIds
  };

  const roomConflicts =
    findRoomTimeConflicts(
      proposedExam
    );

  if (
    roomConflicts.length > 0
  ) {

    const conflictMessage =
      roomConflicts
        .map(
          (conflict) =>
            `${conflict.roomName}: ${
              conflict.message
            }`
        )
        .join("\n");

    if (
      workspaceRoomSaveMessage
    ) {
      workspaceRoomSaveMessage.textContent =
        `Cannot assign these rooms.\n${conflictMessage}`;
    }

    return;
  }


  /* SAVE ROOM IDS */

  exam.roomIds =
    selectedIds;

  exam.roomCount =
    selectedIds.length;


  /* SAVE EXAMINATION */

  updateExamination(
    exam
  );


  /* UPDATE EXAMINATION CARDS */

  renderExaminations();


  /* UPDATE ROOM WORKSPACE */

  renderWorkspaceRooms(
    workspaceRoomSearch
      ? workspaceRoomSearch.value
      : ""
  );


  /* SHOW CONFIRMATION */

  if (workspaceRoomSaveMessage) {

    workspaceRoomSaveMessage.textContent =
      selectedIds.length === 0
        ? "No rooms are assigned to this examination."
        : `${selectedIds.length} ${
            selectedIds.length === 1
              ? "room has"
              : "rooms have"
          } been assigned to this examination.`;
  }
}

/* =========================================================
   EXAM ROOM TIME CONFLICT CHECK
   ========================================================= */

function getExamStartDateTime(exam) {

  if (
    !exam ||
    !exam.date ||
    !exam.startTime
  ) {
    return null;
  }

  const start =
    new Date(
      `${exam.date}T${exam.startTime}`
    );

  return Number.isNaN(
    start.getTime()
  )
    ? null
    : start;
}


function getExamEndDateTime(exam) {

  const start =
    getExamStartDateTime(
      exam
    );

  if (!start) {
    return null;
  }

  /*
    Duration is stored/displayed
    by the examination form.

    Extract the numeric hour value.
    Example:
      "2 hours" → 2
  */

  const durationMatch =
    String(
      exam.duration || ""
    ).match(
      /(\d+(?:\.\d+)?)/
    );

  if (!durationMatch) {
    return null;
  }

  const durationHours =
    Number(
      durationMatch[1]
    );

  if (
    !Number.isFinite(
      durationHours
    )
  ) {
    return null;
  }

  return new Date(
    start.getTime() +
      durationHours *
        60 *
        60 *
        1000
  );
}


function examsOverlap(
  firstExam,
  secondExam
) {

  const firstStart =
    getExamStartDateTime(
      firstExam
    );

  const firstEnd =
    getExamEndDateTime(
      firstExam
    );

  const secondStart =
    getExamStartDateTime(
      secondExam
    );

  const secondEnd =
    getExamEndDateTime(
      secondExam
    );

  if (
    !firstStart ||
    !firstEnd ||
    !secondStart ||
    !secondEnd
  ) {
    return false;
  }

  return (
    firstStart < secondEnd &&
    secondStart < firstEnd
  );
}


function findRoomTimeConflicts(
  exam
) {

  const conflicts = [];

  const exams =
    getExaminations();

  const roomIds =
    Array.isArray(
      exam.roomIds
    )
      ? exam.roomIds
      : [];

  exams.forEach(
    (otherExam) => {

      if (
        otherExam.id ===
        exam.id
      ) {
        return;
      }

      const otherRoomIds =
        Array.isArray(
          otherExam.roomIds
        )
          ? otherExam.roomIds
          : [];

      const sharedRoomIds =
        roomIds.filter(
          (roomId) =>
            otherRoomIds.includes(
              roomId
            )
        );

      if (
        sharedRoomIds.length === 0
      ) {
        return;
      }

      if (
        !examsOverlap(
          exam,
          otherExam
        )
      ) {
        return;
      }

      sharedRoomIds.forEach(
        (roomId) => {

          const room =
            getRooms().find(
              (item) =>
                item.id ===
                roomId
            );

          conflicts.push({
            roomId,
            roomName:
              room
                ? room.name
                : "Unknown room",

            examId:
              otherExam.id,

            examName:
              otherExam.name,

            message:
              `Room ${
                room
                  ? room.name
                  : "Unknown room"
              } is already occupied by "${
                otherExam.name
              }" during this time.`
          });

        }
      );

    }
  );

  return conflicts;
}




/* =========================================================
   SEATING PLAN GENERATOR
   ========================================================= */

function getRoomCapacity(
  room
) {

  if (
    Number(room.capacity) > 0
  ) {

    return Number(
      room.capacity
    );
  }


  if (
    room.type ===
    "standard"
  ) {

    return (
      Number(room.rows) *
      Number(room.columns)
    );
  }


  return (
    Number(room.rows) *
    Number(room.benchesPerRow) *
    Number(
      room.studentsPerBench || 2
    )
  );
}


function getSelectedRoomsForExam(
  exam
) {

  const roomIds =
    Array.isArray(
      exam.roomIds
    )
      ? exam.roomIds
      : [];


  const rooms =
    getRooms();


  return roomIds
    .map(
      (roomId) =>
        rooms.find(
          (room) =>
            room.id === roomId
        )
    )
    .filter(Boolean);
}


function escapeSeatingHtml(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function setSeatingMessage(
  message,
  type = ""
) {

  if (
    !seatingCapacityMessage
  ) {
    return;
  }

  seatingCapacityMessage.textContent =
    message;

  seatingCapacityMessage.classList.toggle(
    "success",
    type === "success"
  );

  seatingCapacityMessage.classList.toggle(
    "error",
    type === "error"
  );
}


function updateSeatingSummary(
  exam
) {

  if (!exam) {

    if (seatingStudentCount) {
      seatingStudentCount.textContent =
        "0";
    }

    if (seatingRoomCount) {
      seatingRoomCount.textContent =
        "0";
    }

    if (seatingCapacity) {
      seatingCapacity.textContent =
        "0";
    }

    setSeatingMessage(
      "Select an examination to check seating capacity."
    );

    return;
  }


  const students =
    Array.isArray(
      exam.studentIds
    )
      ? exam.studentIds
      : [];


  const rooms =
    getSelectedRoomsForExam(
      exam
    );


  const totalCapacity =
    rooms.reduce(
      (
        total,
        room
      ) =>
        total +
        getRoomCapacity(room),
      0
    );


  if (seatingStudentCount) {

    seatingStudentCount.textContent =
      students.length;
  }


  if (seatingRoomCount) {

    seatingRoomCount.textContent =
      rooms.length;
  }


  if (seatingCapacity) {

    seatingCapacity.textContent =
      totalCapacity;
  }


  if (students.length === 0) {

    setSeatingMessage(
      "No students are assigned to this examination.",
      "error"
    );

    return;
  }


  if (rooms.length === 0) {

    setSeatingMessage(
      "No rooms are assigned to this examination.",
      "error"
    );

    return;
  }


  if (
    totalCapacity <
    students.length
  ) {

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


function populateSeatingExamSelect() {

  if (
    !seatingExamSelect
  ) {
    return;
  }


  const examinations =
    getExaminations();


  const currentValue =
    seatingExamSelect.value;


  seatingExamSelect.innerHTML =
    `<option value="">
      Select an examination
    </option>`;


  examinations.forEach(
    (exam) => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        exam.id;

      option.textContent =
        `${exam.name} · ${exam.subject}`;

      seatingExamSelect.appendChild(
        option
      );
    }
  );


  if (
    examinations.some(
      (exam) =>
        exam.id ===
        currentValue
    )
  ) {

    seatingExamSelect.value =
      currentValue;
  }
}


function updateSeatingPlanControls(
  exam
) {

  const plan =
    exam
      ? getSeatingPlanForExam(
          exam.id
        )
      : null;


  const students =
    exam &&
    Array.isArray(
      exam.studentIds
    )
      ? exam.studentIds.length
      : 0;


  const rooms =
    exam
      ? getSelectedRoomsForExam(
          exam
        )
      : [];


  const capacity =
    rooms.reduce(
      (
        total,
        room
      ) =>
        total +
        getRoomCapacity(room),
      0
    );


  const canGenerate =
    Boolean(
      exam &&
      students > 0 &&
      rooms.length > 0 &&
      capacity >= students
    );


  /*
     ---------------------------------------------------------
     BUTTON STATE
     ---------------------------------------------------------
  */

  const isFinalized =
    Boolean(
      plan &&
      plan.status === "Finalized"
    );

  const hasPlan =
    Boolean(plan);


  /*
     Generate button
     
     Show only when there is NO existing plan.
     A finalized plan must never show Generate.
  */

  if (generateSeatingButton) {

    generateSeatingButton.hidden =
      hasPlan;

    generateSeatingButton.disabled =
      !canGenerate ||
      hasPlan;
  }


  /*
     Regenerate button
     
     Show only when a plan exists AND it is NOT finalized.
  */

  if (
    seatingRegenerateButton
  ) {

    seatingRegenerateButton.hidden =
      !hasPlan ||
      isFinalized;
  }


  /*
     Finalize button
     
     Show only for a non-finalized plan.
     It is disabled if conflicts or unassigned
     students exist.
  */

  if (
    finalizeSeatingButton
  ) {

    let canFinalize =
      Boolean(
        plan &&
        !isFinalized
      );


    if (
      plan &&
      exam
    ) {

      const conflicts =
        checkSeatingPlanConflicts(
          plan,
          exam
        );


      const assignedStudentIds =
        new Set(
          Array.isArray(
            plan.assignments
          )
            ? plan.assignments
                .map(
                  (assignment) =>
                    assignment.studentId
                )
                .filter(Boolean)
            : []
        );


      const assignedStudentCount =
        assignedStudentIds.size;


      const expectedStudentCount =
        Array.isArray(
          exam.studentIds
        )
          ? exam.studentIds.length
          : 0;


      const hasUnassignedStudents =
        assignedStudentCount <
        expectedStudentCount;


      if (
        conflicts.length > 0 ||
        hasUnassignedStudents
      ) {

        canFinalize =
          false;
      }
    }


    finalizeSeatingButton.hidden =
      !hasPlan ||
      isFinalized;


    finalizeSeatingButton.disabled =
      !canFinalize;
  }


  /*
     ---------------------------------------------------------
     STATUS BADGE
     ---------------------------------------------------------
  */

  if (
    seatingPlanStatusBadge
  ) {

    const status =
      plan
        ? plan.status
        : "Draft";


    seatingPlanStatusBadge.textContent =
      status;


    seatingPlanStatusBadge.className =
      "seating-status-badge";


    if (
      status ===
      "Generated"
    ) {

      seatingPlanStatusBadge.classList.add(
        "generated"
      );
    }


    if (
      status ===
      "Finalized"
    ) {

      seatingPlanStatusBadge.classList.add(
        "finalized"
      );
    }
  }
}


function renderSeatingPlansPage() {

  if (!seatingExamSelect) {
    return;
  }

  populateSeatingExamSelect();

  /*
     If no examination is currently selected but we already
     have generated seating plans, automatically select the
     most recently generated plan.
  */

  if (!seatingExamSelect.value) {

    const savedPlans =
      getSeatingPlans();

    if (savedPlans.length > 0) {

      const latestPlan =
        savedPlans[savedPlans.length - 1];

      const latestExamExists =
        getExaminationById(
          latestPlan.examId
        );

      if (latestExamExists) {

        seatingExamSelect.value =
          latestPlan.examId;
      }
    }
  }

  const examId =
    seatingExamSelect.value;

  const exam =
    examId
      ? getExaminationById(examId)
      : null;

  updateSeatingSummary(exam);

  updateSeatingPlanControls(exam);

  /*
     No examination selected and no saved
     seating plans exist.
  */

  if (!exam) {

    seatingPlanPreview.hidden =
      true;

    seatingPlanEmpty.hidden =
      false;

    return;
  }

  const plan =
    getSeatingPlanForExam(
      exam.id
    );

  /*
     Examination exists but does not
     have a generated seating plan yet.
  */

  if (!plan) {

    seatingPlanPreview.hidden =
      true;

    seatingPlanEmpty.hidden =
      false;

    return;
  }

  /*
     A generated plan exists.
     Show it immediately.
  */

  seatingPlanEmpty.hidden =
    true;

  seatingPlanPreview.hidden =
    false;

  renderGeneratedSeatingPlan(
    plan,
    exam
  );
}


function generateSeatingPlan() {

  if (
    !seatingExamSelect
  ) {
    return;
  }


  const examId =
    seatingExamSelect.value;


  if (!examId) {

    if (seatingPlanMessage) {

      seatingPlanMessage.textContent =
        "Please select an examination first.";
    }

    return;
  }


  const exam =
    getExaminationById(
      examId
    );


  if (!exam) {
    return;
  }


  const students =
    getStudents()
      .filter(
        (student) =>
          Array.isArray(
            exam.studentIds
          ) &&
          exam.studentIds.includes(
            student.id
          )
      );


  const rooms =
    getSelectedRoomsForExam(
      exam
    );


  const totalCapacity =
    rooms.reduce(
      (
        total,
        room
      ) =>
        total +
        getRoomCapacity(room),
      0
    );


  if (
    students.length === 0
  ) {

    setSeatingMessage(
      "Cannot generate the plan because no students are assigned.",
      "error"
    );

    return;
  }


  if (
    rooms.length === 0
  ) {

    setSeatingMessage(
      "Cannot generate the plan because no rooms are assigned.",
      "error"
    );

    return;
  }


  if (
    totalCapacity <
    students.length
  ) {

    setSeatingMessage(
      `Cannot generate the plan. ${students.length} students need seats, but only ${totalCapacity} are available.`,
      "error"
    );

    return;
  }


  const plan =
    ExamSeatSeatingAlgorithm.createPlan(
      exam,
      students,
      rooms
    );


  if (
    plan.unassignedStudentIds.length >
    0
  ) {

    setSeatingMessage(
      "The plan could not place every assigned student.",
      "error"
    );

    return;
  }


  /* Kept temporarily as a readable reference for the original prototype allocator. */
  if (false) {
  let studentIndex =
    0;


  const roomPlans =
    [];


  /*
     Assign students room by room.
     This is intentionally simple for now.
     Person A can later replace this
     with the final backend algorithm.
  */

  rooms.forEach(
    (room) => {

      const assignments =
        [];


      if (
        room.type ===
        "standard"
      ) {

        for (
          let row = 1;
          row <=
            Number(room.rows);
          row++
        ) {

          for (
            let column = 1;
            column <=
              Number(room.columns);
            column++
          ) {

            if (
              studentIndex >=
              students.length
            ) {
              break;
            }


            const student =
              students[
                studentIndex
              ];


            assignments.push({

              studentId:
                student.id,

              studentName:
                student.name,

              studentNumber:
                student.studentId,

              row,

              column,

              seat:
                `R${row}-C${column}`
            });


            studentIndex++;
          }


          if (
            studentIndex >=
            students.length
          ) {
            break;
          }
        }

      } else {

        const studentsPerBench =
          Number(
            room.studentsPerBench ||
            2
          );


        for (
          let row = 1;
          row <=
            Number(room.rows);
          row++
        ) {

          for (
            let bench = 1;
            bench <=
              Number(
                room.benchesPerRow
              );
            bench++
          ) {

            for (
              let position = 1;
              position <=
                studentsPerBench;
              position++
            ) {

              if (
                studentIndex >=
                students.length
              ) {
                break;
              }


              const student =
                students[
                  studentIndex
                ];


              assignments.push({

                studentId:
                  student.id,

                studentName:
                  student.name,

                studentNumber:
                  student.studentId,

                row,

                bench,

                position,

                seat:
                  `R${row}-B${bench}-P${position}`
              });


              studentIndex++;
            }


            if (
              studentIndex >=
              students.length
            ) {
              break;
            }
          }


          if (
            studentIndex >=
            students.length
          ) {
            break;
          }
        }
      }


      roomPlans.push({

        roomId:
          room.id,

        roomName:
          room.name,

        type:
          room.type,

        rows:
          Number(room.rows),

        columns:
          Number(
            room.columns || 0
          ),

        benchesPerRow:
          Number(
            room.benchesPerRow || 0
          ),

        studentsPerBench:
          Number(
            room.studentsPerBench || 2
          ),

        capacity:
          getRoomCapacity(room),

        assignments
      });
    }
  );


  if (
    studentIndex <
    students.length
  ) {

    setSeatingMessage(
      "The plan could not place every assigned student.",
      "error"
    );

    return;
  }


  const plan = {

    id:
      `plan-${exam.id}`,

    examId:
      exam.id,

    status:
      "Generated",

    generatedAt:
      new Date().toISOString(),

    studentCount:
      students.length,

    capacity:
      totalCapacity,

    rooms:
      roomPlans,

    assignments:
      roomPlans.flatMap(
        (room) =>
          room.assignments
            .map(
              (assignment) => ({
                ...assignment,
                roomId:
                  room.roomId,
                roomName:
                  room.roomName
              })
            )
      )
  };


  }


  const plans =
    getSeatingPlans()
      .filter(
        (existingPlan) =>
          existingPlan.examId !==
          exam.id
      );


  plans.push(
    plan
  );


  saveSeatingPlans(
    plans
  );

  updateDashboardStats();


  exam.seatingPlanStatus =
    "Generated";


  updateExamination(
    exam
  );


  renderExaminations();


  renderSeatingPlansPage();


  if (seatingPlanMessage) {

    seatingPlanMessage.textContent =
      "Seating plan generated successfully.";
  }
}


/* =========================================================
   SEATING PLAN CONFLICT CHECKING
   ========================================================= */

function checkSeatingPlanConflicts(
  plan,
  exam
) {

  const conflicts = [];

  if (!plan || !exam) {
    return conflicts;
  }


  const expectedStudentIds =
    Array.isArray(exam.studentIds)
      ? exam.studentIds
      : [];


  const selectedRoomIds =
    Array.isArray(exam.roomIds)
      ? exam.roomIds
      : [];


  const assignments =
    Array.isArray(plan.assignments)
      ? plan.assignments
      : [];


  /*
     1. Check for duplicate students
  */

  const studentOccurrences =
    new Map();

  assignments.forEach(
    (assignment) => {

      if (!assignment.studentId) {
        return;
      }

      const count =
        studentOccurrences.get(
          assignment.studentId
        ) || 0;

      studentOccurrences.set(
        assignment.studentId,
        count + 1
      );
    }
  );


  studentOccurrences.forEach(
    (count, studentId) => {

      if (count > 1) {

        conflicts.push({
          type: "duplicate-student",
          studentId,
          message:
            `Student ${studentId} has been assigned to ${count} seats.`
        });
      }
    }
  );


  /*
     2. Check for students who are
        assigned to the examination
        but missing from the plan.
  */

  const assignedStudentIds =
    new Set(
      assignments.map(
        (assignment) =>
          assignment.studentId
      )
    );


  expectedStudentIds.forEach(
    (studentId) => {

      if (
        !assignedStudentIds.has(
          studentId
        )
      ) {

        conflicts.push({
          type: "missing-student",
          studentId,
          message:
            `Student ${studentId} has not been assigned a seat.`
        });
      }
    }
  );


  /*
     3. Check for assignments to
        rooms that aren't assigned
        to this examination.
  */

  assignments.forEach(
    (assignment) => {

      if (
        !selectedRoomIds.includes(
          assignment.roomId
        )
      ) {

        conflicts.push({
          type: "invalid-room",
          roomId:
            assignment.roomId,
          studentId:
            assignment.studentId,
          message:
            `Student ${assignment.studentId} is assigned to a room that is not assigned to this examination.`
        });
      }
    }
  );


  /*
     4. Check for duplicate seats.
  */

  const seatOccurrences =
    new Map();

  assignments.forEach(
    (assignment) => {

      if (
        !assignment.roomId ||
        !assignment.seat
      ) {
        return;
      }

      const seatKey =
        `${assignment.roomId}::${assignment.seat}`;

      const count =
        seatOccurrences.get(
          seatKey
        ) || 0;

      seatOccurrences.set(
        seatKey,
        count + 1
      );
    }
  );


  seatOccurrences.forEach(
    (count, seatKey) => {

      if (count > 1) {

        const parts =
          seatKey.split("::");

        conflicts.push({
          type: "duplicate-seat",
          roomId:
            parts[0],
          seat:
            parts[1],
          message:
            `Seat ${parts[1]} in room ${parts[0]} is assigned to multiple students.`
        });
      }
    }
  );


  /*
     5. Check room capacity.
  */

  const roomAssignments =
    new Map();


  assignments.forEach(
    (assignment) => {

      if (!assignment.roomId) {
        return;
      }

      const count =
        roomAssignments.get(
          assignment.roomId
        ) || 0;

      roomAssignments.set(
        assignment.roomId,
        count + 1
      );
    }
  );


  const rooms =
    getSelectedRoomsForExam(
      exam
    );


  rooms.forEach(
    (room) => {

      const assigned =
        roomAssignments.get(
          room.id
        ) || 0;

      const capacity =
        getRoomCapacity(
          room
        );


      if (
        assigned >
        capacity
      ) {

        conflicts.push({
          type: "room-capacity",
          roomId:
            room.id,
          message:
            `${room.name} has ${assigned} students assigned but only has ${capacity} seats.`
        });
      }
    }
  );


  /*
     Person A's rule: students from the same section should
     not sit next to each other when a valid alternative exists.
  */
  conflicts.push(
    ...ExamSeatSeatingAlgorithm.findSectionAdjacencyConflicts(
      plan,
      getStudents(),
      rooms
    )
  );


  return conflicts;
}


function renderGeneratedSeatingPlan(
  plan,
  exam
) {

  const conflicts =
    checkSeatingPlanConflicts(
      plan,
      exam
    );

      /* =========================================================
     REVIEW SUMMARY
     ========================================================= */

  const assignments =
    Array.isArray(
      plan.assignments
    )
      ? plan.assignments
      : [];

  const expectedStudentIds =
    Array.isArray(
      exam.studentIds
    )
      ? exam.studentIds
      : [];

  const assignedStudentIds =
    new Set(
      assignments
        .map(
          (assignment) =>
            assignment.studentId
        )
        .filter(Boolean)
    );

  const assignedStudentCount =
    assignedStudentIds.size;

  const expectedStudentCount =
    expectedStudentIds.length;

  const unassignedStudentCount =
    Math.max(
      0,
      expectedStudentCount -
        assignedStudentCount
    );

  const roomsUsedCount =
    Array.isArray(plan.rooms)
      ? plan.rooms.filter(
          (room) =>
            Array.isArray(
              room.assignments
            ) &&
            room.assignments.length > 0
        ).length
      : 0;

  const conflictCount =
    conflicts.length;


  if (seatingReviewPanel) {
    seatingReviewPanel.hidden =
      false;
  }


  if (reviewAssignedStudents) {
    reviewAssignedStudents.textContent =
      `${assignedStudentCount} / ${expectedStudentCount}`;
  }


  if (reviewRoomsUsed) {
    reviewRoomsUsed.textContent =
      roomsUsedCount;
  }


  if (reviewSeatsAvailable) {
    reviewSeatsAvailable.textContent =
      plan.capacity || 0;
  }


  if (reviewUnassignedStudents) {
    reviewUnassignedStudents.textContent =
      unassignedStudentCount;
  }


  if (reviewConflictCount) {
    reviewConflictCount.textContent =
      conflictCount;
  }


  const hasProblems =
    conflictCount > 0 ||
    unassignedStudentCount > 0 ||
    assignedStudentCount <
      expectedStudentCount;


  if (seatingReviewStatus) {

  seatingReviewStatus.classList.toggle(
    "warning",
    hasProblems
  );

  seatingReviewStatus.textContent =
    hasProblems
      ? "Conflicts detected"
      : "Ready for review";
}


  if (seatingReviewMessage) {

  seatingReviewMessage.classList.toggle(
    "warning",
    hasProblems
  );


  if (hasProblems) {

    const conflictText =
      conflictCount > 0
        ? `${conflictCount} conflict${
            conflictCount === 1
              ? ""
              : "s"
          } detected`
        : "No conflicts detected";


    const unassignedText =
      unassignedStudentCount > 0
        ? ` ${unassignedStudentCount} student${
            unassignedStudentCount === 1
              ? ""
              : "s"
          } unassigned.`
        : "";


    seatingReviewMessage.textContent =
      `⚠ ${conflictText}.${unassignedText} The plan cannot be finalized until it is valid.`;

  } else {

    seatingReviewMessage.textContent =
      "✓ Seating plan is valid and ready for review.";
  }
}

  if (
    !seatingRoomList
  ) {
    return;
  }


  if (seatingPreviewTitle) {

    seatingPreviewTitle.textContent =
      exam.name;
  }


 if (seatingPreviewMeta) {

  const assignedCount =
    Array.isArray(
      plan.assignments
    )
      ? plan.assignments.length
      : 0;

  const expectedCount =
    Array.isArray(
      exam.studentIds
    )
      ? exam.studentIds.length
      : 0;

  seatingPreviewMeta.textContent =
    `${exam.subject} · ${
      formatExamDate(
        exam.date
      )
    } · ${
      assignedCount
    } / ${
      expectedCount
    } students assigned · ${
      plan.capacity
    } available seats`;
}


  seatingRoomList.innerHTML =
    "";


  plan.rooms.forEach(
    (room) => {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "panel seating-room-card";


      const typeLabel =
        room.type ===
        "standard"
          ? "Standard Classroom"
          : "Bench Classroom";


      const cardHeader =
        document.createElement(
          "div"
        );


      cardHeader.className =
        "seating-room-header";


      cardHeader.innerHTML = `
        <div>
          <p class="eyebrow">
            ${typeLabel}
          </p>

          <h3>
            ${escapeSeatingHtml(
              room.roomName
            )}
          </h3>

          <p>
            ${
              room.type ===
              "standard"
                ? `${room.rows} rows × ${room.columns} columns`
                : `${room.rows} rows × ${room.benchesPerRow} benches · 2 students per bench`
            }
          </p>
        </div>

        <span class="seating-room-count">
          ${room.assignments.length} students
        </span>
      `;


      card.appendChild(
        cardHeader
      );


      const tableWrap =
        document.createElement(
          "div"
        );


      tableWrap.className =
        "seating-table-wrap";


      if (
        room.type ===
        "standard"
      ) {

        const table =
          document.createElement(
            "table"
          );


        table.className =
          "seating-table";


        let html =
          "<thead><tr><th>Row</th>";


        for (
          let column = 1;
          column <=
            room.columns;
          column++
        ) {

          html +=
            `<th>Seat ${column}</th>`;
        }


        html +=
          "</tr></thead><tbody>";


        for (
          let row = 1;
          row <=
            room.rows;
          row++
        ) {

          html +=
            `<tr><th>Row ${row}</th>`;


          for (
            let column = 1;
            column <=
              room.columns;
            column++
          ) {

            const assignment =
              room.assignments.find(
                (item) =>
                  item.row === row &&
                  item.column ===
                    column
              );


            if (assignment) {

  const subject =
    String(
      assignment.studentSubject ||
      assignment.subject ||
      assignment.student?.subject ||
      ""
    ).trim();


  const subjectClass =
    subject
      ? `seat-subject-${subject
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`
      : "seat-subject-unknown";


  html += `
    <td class="${subjectClass}">
      <span class="seat-assignment-name">
        ${escapeSeatingHtml(
          assignment.studentName
        )}
      </span>

      <span class="seat-assignment-id">
        ${escapeSeatingHtml(
          assignment.studentNumber
        )}
      </span>
    </td>
  `;

} else {

              html += `
                <td>
                  <span class="seat-assignment-empty">
                    Available
                  </span>
                </td>
              `;
            }
          }


          html +=
            "</tr>";
        }


        html +=
          "</tbody>";


        table.innerHTML =
          html;


        tableWrap.appendChild(
          table
        );

      } else {

        const table =
          document.createElement(
            "table"
          );


        table.className =
          "seating-table";


        let html =
          "<thead><tr><th>Row</th>";


        for (
          let bench = 1;
          bench <=
            room.benchesPerRow;
          bench++
        ) {

          html +=
            `<th>Bench ${bench}</th>`;
        }


        html +=
          "</tr></thead><tbody>";


        for (
          let row = 1;
          row <=
            room.rows;
          row++
        ) {

          html +=
            `<tr><th>Row ${row}</th>`;


          for (
            let bench = 1;
            bench <=
              room.benchesPerRow;
            bench++
          ) {

            const first =
              room.assignments.find(
                (item) =>
                  item.row === row &&
                  item.bench ===
                    bench &&
                  item.position ===
                    1
              );


            const second =
              room.assignments.find(
                (item) =>
                  item.row === row &&
                  item.bench ===
                    bench &&
                  item.position ===
                    2
              );


            html += `
              <td class="bench-seat-cell">

                <div class="bench-seat">

                  <span>
                    ${
                      first
                        ? `
                          <span class="seat-assignment-name">
                            ${escapeSeatingHtml(
                              first.studentName
                            )}
                          </span>
                          <span class="seat-assignment-id">
                            ${escapeSeatingHtml(
                              first.studentNumber
                            )}
                          </span>
                        `
                        : `
                          <span class="seat-assignment-empty">
                            Available
                          </span>
                        `
                    }
                  </span>

                  <span>
                    ${
                      second
                        ? `
                          <span class="seat-assignment-name">
                            ${escapeSeatingHtml(
                              second.studentName
                            )}
                          </span>
                          <span class="seat-assignment-id">
                            ${escapeSeatingHtml(
                              second.studentNumber
                            )}
                          </span>
                        `
                        : `
                          <span class="seat-assignment-empty">
                            Available
                          </span>
                        `
                    }
                  </span>

                </div>

              </td>
            `;
          }


          html +=
            "</tr>";
        }


        html +=
          "</tbody>";


        table.innerHTML =
          html;


        tableWrap.appendChild(
          table
        );
      }


      card.appendChild(
        tableWrap
      );


      const note =
        document.createElement(
          "p"
        );


      note.className =
        "seating-plan-note";


      note.textContent =
        "Seats are assigned sequentially for this prototype. The final backend algorithm can replace this allocation later.";


      card.appendChild(
        note
      );


      seatingRoomList.appendChild(
        card
      );
    }
  );
}


function finalizeSeatingPlan() {

  if (
    !seatingExamSelect
  ) {
    return;
  }


  const examId =
    seatingExamSelect.value;


  const exam =
    getExaminationById(
      examId
    );


  const plan =
    getSeatingPlanForExam(
      examId
    );


  if (
    !exam ||
    !plan
  ) {
    return;
  }


  /*
     Safety check:
     Never allow the confirmation modal
     to open for an invalid plan.
  */

  const conflicts =
    checkSeatingPlanConflicts(
      plan,
      exam
    );


  const assignedStudentIds =
    new Set(
      Array.isArray(
        plan.assignments
      )
        ? plan.assignments
            .map(
              (assignment) =>
                assignment.studentId
            )
            .filter(Boolean)
        : []
    );


  const assignedStudentCount =
    assignedStudentIds.size;


  const expectedStudentCount =
    Array.isArray(
      exam.studentIds
    )
      ? exam.studentIds.length
      : 0;


  const hasUnassignedStudents =
    assignedStudentCount <
    expectedStudentCount;


  if (
    conflicts.length > 0 ||
    hasUnassignedStudents ||
    plan.status ===
      "Finalized"
  ) {
    return;
  }


  /*
     Fill confirmation modal.
  */

  if (finalizeModalStudents) {

    finalizeModalStudents.textContent =
      `${assignedStudentCount} / ${expectedStudentCount}`;
  }


  if (finalizeModalRooms) {

    const roomsUsed =
      Array.isArray(plan.rooms)
        ? plan.rooms.filter(
            (room) =>
              Array.isArray(
                room.assignments
              ) &&
              room.assignments.length > 0
          ).length
        : getSelectedRoomsForExam(
            exam
          ).length;


    finalizeModalRooms.textContent =
      roomsUsed;
  }


  if (finalizeModalConflicts) {

    finalizeModalConflicts.textContent =
      conflicts.length;
  }


  /*
     Open confirmation modal.
  */

  if (finalizeModalBackdrop) {

    finalizeModalBackdrop.hidden =
      false;
  }
}

function confirmFinalizeSeatingPlan() {

  if (
    !seatingExamSelect
  ) {
    return;
  }


  const examId =
    seatingExamSelect.value;


  const exam =
    getExaminationById(
      examId
    );


  const plan =
    getSeatingPlanForExam(
      examId
    );


  if (
    !exam ||
    !plan
  ) {
    return;
  }


  /*
     Final safety validation.
  */

  const conflicts =
    checkSeatingPlanConflicts(
      plan,
      exam
    );


  const assignedStudentIds =
    new Set(
      Array.isArray(
        plan.assignments
      )
        ? plan.assignments
            .map(
              (assignment) =>
                assignment.studentId
            )
            .filter(Boolean)
        : []
    );


  const expectedStudentCount =
    Array.isArray(
      exam.studentIds
    )
      ? exam.studentIds.length
      : 0;


  if (
    conflicts.length > 0 ||
    assignedStudentIds.size <
      expectedStudentCount ||
    plan.status ===
      "Finalized"
  ) {

    closeFinalizeModal();

    return;
  }


  /*
     Actually finalize the plan.
  */

  plan.status =
    "Finalized";

  plan.finalizedAt =
    new Date().toISOString();


  const plans =
    getSeatingPlans()
      .filter(
        (item) =>
          item.examId !==
          examId
      );


  plans.push(
    plan
  );


  saveSeatingPlans(
    plans
  );

  updateDashboardStats();


  exam.seatingPlanStatus =
    "Finalized";

  exam.status =
    "Finalized";


  updateExamination(
    exam
  );


  closeFinalizeModal();


  renderExaminations();

  renderSeatingPlansPage();
}


function closeFinalizeModal() {

  if (
    finalizeModalBackdrop
  ) {

    finalizeModalBackdrop.hidden =
      true;
  }
}


/* =========================================================
   ROOM TYPE CHANGE
   ========================================================= */

if (roomType) {

  roomType.addEventListener(
    "change",
    () => {

      updateRoomTypeUI();

      updateRoomCapacity();
    }
  );
}


/* =========================================================
   ROOM CAPACITY LIVE CALCULATION
   ========================================================= */

[
  "roomRows",
  "roomColumns",
  "benchRows",
  "benchesPerRow"
].forEach((id) => {

  const input =
    document.getElementById(id);


  if (input) {

    input.addEventListener(
      "input",
      updateRoomCapacity
    );
  }
});


/* =========================================================
   ROOM FORM SUBMISSION
   ========================================================= */

if (roomForm) {

  roomForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      if (!validateRoomForm()) {

        return;
      }


      const rooms =
        getRooms();


      const room = {

        id:
          `room-${Date.now()}`,

        name:
          document
            .getElementById(
              "roomName"
            )
            .value
            .trim(),

        type:
          roomType.value
      };


      /* STANDARD CLASSROOM */

      if (
        room.type ===
        "standard"
      ) {

        room.rows =
          Number(
            document
              .getElementById(
                "roomRows"
              )
              .value
          );


        room.columns =
          Number(
            document
              .getElementById(
                "roomColumns"
              )
              .value
          );


        room.capacity =
          room.rows *
          room.columns;
      }


      /* BENCH CLASSROOM */

      else {

        room.rows =
          Number(
            document
              .getElementById(
                "benchRows"
              )
              .value
          );


        room.benchesPerRow =
          Number(
            document
              .getElementById(
                "benchesPerRow"
              )
              .value
          );


        room.studentsPerBench =
          2;


        room.capacity =
          room.rows *
          room.benchesPerRow *
          room.studentsPerBench;
      }


      rooms.push(room);

      saveRooms(rooms);
      updateDashboardStats();



      roomForm.reset();

      clearRoomErrors();

      updateRoomTypeUI();


      showTeacherView(
        "rooms"
      );


      renderRooms();
    }
  );
}


/* =========================================================
   DELETE ROOM
   ========================================================= */

if (roomList) {

  roomList.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          ".room-delete-button"
        );

      if (!button) {
        return;
      }


      const roomId =
        button.dataset.roomId;


      const rooms =
        getRooms().filter(
          (room) =>
            room.id !== roomId
        );

      saveRooms(rooms);


      /*
         Remove deleted room
         from every examination
      */

      const examinations =
        getExaminations();


      examinations.forEach(
        (exam) => {

          if (
            Array.isArray(
              exam.roomIds
            )
          ) {

            exam.roomIds =
              exam.roomIds.filter(
                (id) =>
                  id !== roomId
              );

            exam.roomCount =
              exam.roomIds.length;
          }
        }
      );


      saveExaminations(
        examinations
      );


      renderRooms();
      updateDashboardStats();

      renderExaminations();
    }
  );
}


/* =========================================================
   CANCEL ROOM CREATION
   ========================================================= */

function cancelRoomCreation() {

  roomForm.reset();

  clearRoomErrors();

  updateRoomTypeUI();

  showTeacherView(
    "rooms"
  );
}


const cancelRoomButton =
  document.getElementById(
    "cancelRoom"
  );


const cancelRoomTopButton =
  document.getElementById(
    "cancelRoomTop"
  );


if (cancelRoomButton) {

  cancelRoomButton.addEventListener(
    "click",
    cancelRoomCreation
  );
}


if (cancelRoomTopButton) {

  cancelRoomTopButton.addEventListener(
    "click",
    cancelRoomCreation
  );
}

/* =========================================================
   CANCEL STUDENT CREATION
   ========================================================= */

function cancelStudentCreation() {

  studentForm.reset();

  clearStudentErrors();

  showTeacherView(
    "students"
  );
}


const cancelStudent =
  document.getElementById(
    "cancelStudent"
  );


const cancelStudentTop =
  document.getElementById(
    "cancelStudentTop"
  );


if (cancelStudent) {

  cancelStudent.addEventListener(
    "click",
    cancelStudentCreation
  );
}


if (cancelStudentTop) {

  cancelStudentTop.addEventListener(
    "click",
    cancelStudentCreation
  );
}

/* =========================================================
   ADD STUDENT
   ========================================================= */

if (studentForm) {

  studentForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      if (!validateStudentForm()) {
        return;
      }


      const students =
        getStudents();


      const student = {

        id:
          `student-${Date.now()}`,

        studentId:
          document
            .getElementById(
              "studentId"
            )
            .value
            .trim(),

        name:
          document
            .getElementById(
              "studentName"
            )
            .value
            .trim(),

        course:
          document
            .getElementById(
              "studentCourse"
            )
            .value
            .trim(),

        subject:
          document
            .getElementById(
              "studentSubject"
            )
            .value
            .trim(),


        section:
          document
            .getElementById(
              "studentSection"
            )
            .value
            .trim()
      };


      students.push(
        student
      );


      saveStudents(
        students
      );


      studentForm.reset();

      clearStudentErrors();


      showTeacherView(
        "students"
      );


      renderStudents();
      updateDashboardStats();
    }
  );
}

/* =========================================================
   DELETE STUDENT
   ========================================================= */

if (studentList) {

  studentList.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          ".student-delete-button"
        );


      if (!button) {
        return;
      }


      const studentId =
        button.dataset.studentId;


      const students =
        getStudents().filter(
          (student) =>
            student.id !== studentId
        );


      saveStudents(
        students
      );


      renderStudents(
        studentSearch
          ? studentSearch.value
          : ""
      );
      updateDashboardStats();
    }
  );
}

/* =========================================================
   STUDENT SEARCH
   ========================================================= */

if (studentSearch) {

  studentSearch.addEventListener(
    "input",
    () => {

      renderStudents(
        studentSearch.value
      );
    }
  );
}

/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

const menuButton =
  document.getElementById(
    "menuButton"
  );


if (menuButton) {

  menuButton.addEventListener(
    "click",
    () => {

      const open =
        teacherSidebar.classList.toggle(
          "open"
        );


      menuButton.setAttribute(
        "aria-expanded",
        String(open)
      );


      teacherOverlay.hidden =
        !open;
    }
  );
}


/* =========================================================
   OVERLAY
   ========================================================= */

if (teacherOverlay) {

  teacherOverlay.addEventListener(
    "click",
    () => {

      teacherSidebar.classList.remove(
        "open"
      );

      teacherOverlay.hidden =
        true;
    }
  );
}


/* =========================================================
   BROWSER BACK / FORWARD
   ========================================================= */

window.addEventListener(
  "popstate",
  () => {

    showTeacherView(
      window.location.hash.slice(1),
      false
    );
    updateDashboardStats();

    window.addEventListener("storage", (event) => {
  if (
    event.key === "examSeatStudents" ||
    event.key === "examSeatRooms" ||
    event.key === "examSeatSeatingPlans"
  ) {
    updateDashboardStats();
  }
});
  }
);


/* =========================================================
   INITIAL LOAD
   ========================================================= */

renderExaminations();
renderRooms();
renderStudents();
populateSeatingExamSelect();

showTeacherView(
  window.location.hash.slice(1),
  false
);

/* =========================================================
   STEP 5 — LOGOUT
   ========================================================= */

function logoutExamSeat() {

  localStorage.removeItem(
    "examSeatSession"
  );

  window.location.replace(
    "index.html"
  );

}
