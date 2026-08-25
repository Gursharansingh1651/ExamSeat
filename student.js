"use strict";

const studentViews =
  document.querySelectorAll(".student-view");

const studentLinks =
  document.querySelectorAll("[data-view]");

const seatFinder =
  document.getElementById("seatFinder");

const formMessage =
  document.getElementById("formMessage");

const seatResult =
  document.getElementById("seatResult");

const studentExam =
  document.getElementById("studentExam");

let activeSeatRecord = null;


/* =========================================================
   STORAGE
   These keys are shared with the teacher portal.
   ========================================================= */

const examinationStorageKey =
  "examSeatExaminations";

const studentStorageKey =
  "examSeatStudents";

const seatingPlansStorageKey =
  "examSeatSeatingPlans";


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function readStorageArray(
  key
) {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(key)
      );

    return Array.isArray(saved)
      ? saved
      : [];

  } catch (error) {

    return [];
  }
}


function getExaminations() {

  return readStorageArray(
    examinationStorageKey
  );
}


function getStudents() {

  return readStorageArray(
    studentStorageKey
  );
}


function getSeatingPlans() {

  return readStorageArray(
    seatingPlansStorageKey
  );
}


/* =========================================================
   FINALIZED EXAMINATIONS
   Only examinations with a finalized seating plan
   are available to students.
   ========================================================= */

function getFinalizedExaminations() {

  const examinations =
    getExaminations();

  const seatingPlans =
    getSeatingPlans();


  return examinations.filter(
    (exam) => {

      const plan =
        seatingPlans.find(
          (item) =>
            item.examId ===
            exam.id
        );


      return Boolean(
        plan &&
        plan.status ===
          "Finalized"
      );
    }
  );
}


/* =========================================================
   POPULATE EXAMINATION DROPDOWN
   ========================================================= */

function populateExamSelect() {

  if (!studentExam) {
    return;
  }


  const currentValue =
    studentExam.value;


  const examinations =
    getFinalizedExaminations();


  studentExam.innerHTML =
    `<option value="">
      Select your examination
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


      studentExam.appendChild(
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

    studentExam.value =
      currentValue;
  }
}


/* =========================================================
   NORMALISE INPUT
   ========================================================= */

function normalise(
  value
) {

  return String(
    value || ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      " "
    );
}


function getSeatingRecords() {
  try {
    const publishedRecords = JSON.parse(localStorage.getItem("examSeatPublishedSeating"));
    return Array.isArray(publishedRecords) && publishedRecords.length ? publishedRecords : mockSeatingRecords;
  } catch (error) {
    return mockSeatingRecords;
  }
}

function normalise(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function showStudentView(viewId, updateHash = true) {
  const requestedView = document.getElementById(viewId);
  const view = requestedView && (requestedView.id !== "seat-visualisation" || activeSeatRecord) ? requestedView : document.getElementById("home");
  studentViews.forEach((item) => {
    const active = item === view;
    item.hidden = !active;
    item.classList.toggle("active", active);
  });
  studentLinks.forEach((link) => link.classList.toggle("active", link.dataset.view === view.id));
  if (updateHash) history.pushState({ view: view.id }, "", `#${view.id}`);
}

function renderSeatMap(record) {

  const seatMap =
    document.getElementById("seatMap");

  if (!seatMap) {
    return;
  }

  seatMap.innerHTML = "";

  const room =
    record.roomData || {};

  const assignments =
    Array.isArray(room.assignments)
      ? room.assignments
      : [];


  /*
   =========================================================
   STANDARD CLASSROOM
   =========================================================
  */

  if (room.type === "standard") {

    const table =
      document.createElement("table");

    table.className =
      "seating-table student-seating-table";

    let html =
      "<thead><tr><th>Row</th>";

    for (
      let column = 1;
      column <= Number(room.columns);
      column++
    ) {

      html +=
        `<th>Seat ${column}</th>`;
    }

    html +=
      "</tr></thead><tbody>";


    for (
      let row = 1;
      row <= Number(room.rows);
      row++
    ) {

      html +=
        `<tr><th>Row ${row}</th>`;


      for (
        let column = 1;
        column <= Number(room.columns);
        column++
      ) {

        const assignment =
          assignments.find(
            (item) =>
              item.row === row &&
              item.column === column
          );


        const seat =
          `R${row}-C${column}`;


        const isMySeat =
          seat === record.seat;


        if (isMySeat) {

          html += `
            <td class="student-seat-cell my-seat">
              <span class="student-seat-label">
                ${seat}
              </span>
              <span class="student-seat-status">
                YOUR SEAT
              </span>
            </td>
          `;

        } else if (assignment) {

          html += `
            <td class="student-seat-cell occupied-seat">
              <span class="student-seat-label">
                ${seat}
              </span>
              <span class="student-seat-status">
                Occupied
              </span>
            </td>
          `;

        } else {

          html += `
            <td class="student-seat-cell available-seat">
              <span class="student-seat-label">
                ${seat}
              </span>
              <span class="student-seat-status">
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

    seatMap.appendChild(
      table
    );
  }


  /*
   =========================================================
   BENCH CLASSROOM
   =========================================================
  */

  else if (
    room.type === "bench"
  ) {

    const table =
      document.createElement("table");

    table.className =
      "seating-table student-seating-table";


    let html =
      "<thead><tr><th>Row</th>";


    for (
      let bench = 1;
      bench <= Number(room.benchesPerRow);
      bench++
    ) {

      html +=
        `<th>Bench ${bench}</th>`;
    }


    html +=
      "</tr></thead><tbody>";


    for (
      let row = 1;
      row <= Number(room.rows);
      row++
    ) {

      html +=
        `<tr><th>Row ${row}</th>`;


      for (
        let bench = 1;
        bench <= Number(room.benchesPerRow);
        bench++
      ) {

        const first =
          assignments.find(
            (item) =>
              item.row === row &&
              item.bench === bench &&
              item.position === 1
          );


        const second =
          assignments.find(
            (item) =>
              item.row === row &&
              item.bench === bench &&
              item.position === 2
          );


        const firstSeat =
          `R${row}-B${bench}-P1`;

        const secondSeat =
          `R${row}-B${bench}-P2`;


        const firstMine =
          firstSeat === record.seat;

        const secondMine =
          secondSeat === record.seat;


        html += `
          <td class="bench-seat-cell">
            <div class="bench-seat student-bench-seat">

              <span class="${
                firstMine
                  ? "my-seat"
                  : first
                    ? "occupied-seat"
                    : "available-seat"
              }">

                <strong>
                  ${firstSeat}
                </strong>

                <small>
                  ${
                    firstMine
                      ? "YOUR SEAT"
                      : first
                        ? "Occupied"
                        : "Available"
                  }
                </small>

              </span>


              <span class="${
                secondMine
                  ? "my-seat"
                  : second
                    ? "occupied-seat"
                    : "available-seat"
              }">

                <strong>
                  ${secondSeat}
                </strong>

                <small>
                  ${
                    secondMine
                      ? "YOUR SEAT"
                      : second
                        ? "Occupied"
                        : "Available"
                  }
                </small>

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


    seatMap.appendChild(
      table
    );
  }


  /*
   =========================================================
   ROOM INFORMATION
   =========================================================
  */

  document.getElementById(
    "mapRoom"
  ).textContent =
    record.room;


  document.getElementById(
    "visualisationSummary"
  ).textContent =
    `${record.studentName}, your allocated seat is ${record.seat} in Room ${record.room}.`;
}

studentLinks.forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  showStudentView(link.dataset.view);
}));
document.querySelectorAll("[data-go-to]").forEach((button) => button.addEventListener("click", () => showStudentView(button.dataset.goTo)));

seatFinder.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!seatFinder.checkValidity()) {
    formMessage.textContent = "Please complete your Student ID, name, and examination.";
    formMessage.className = "form-message error-message";
    seatResult.hidden = true;
    seatFinder.reportValidity();
    return;
  }

 const studentId =
  normalise(
    seatFinder.studentId.value
  );

const studentName =
  normalise(
    seatFinder.studentName.value
  );

const examId =
  seatFinder.studentExam.value;


/* =========================================================
   LOAD CURRENT DATA
   ========================================================= */

const examinations =
  getExaminations();

const students =
  getStudents();

const seatingPlans =
  getSeatingPlans();


const exam =
  examinations.find(
    (item) =>
      item.id ===
      examId
  );


/* =========================================================
   EXAMINATION CHECK
   ========================================================= */

if (!exam) {

  activeSeatRecord = null;

  seatResult.hidden =
    true;

  formMessage.textContent =
    "Please select a valid examination.";

  formMessage.className =
    "form-message error-message";

  return;
}


/* =========================================================
   FINALIZED PLAN CHECK
   ========================================================= */

const plan =
  seatingPlans.find(
    (item) =>
      item.examId ===
        examId &&
      item.status ===
        "Finalized"
  );


if (!plan) {

  activeSeatRecord = null;

  seatResult.hidden =
    true;

  formMessage.textContent =
    "The seating plan for this examination has not been finalized yet.";

  formMessage.className =
    "form-message error-message";

  return;
}


/* =========================================================
   STUDENT CHECK
   ========================================================= */

const student =
  students.find(
    (item) =>
      normalise(
        item.studentId
      ) === studentId &&
      normalise(
        item.name ||
        item.studentName
      ) === studentName
  );


if (!student) {

  activeSeatRecord = null;

  seatResult.hidden =
    true;

  formMessage.textContent =
    "Student ID and full name do not match our records.";

  formMessage.className =
    "form-message error-message";

  return;
}


/* =========================================================
   FIND ASSIGNMENT
   ========================================================= */

const assignment =
  Array.isArray(
    plan.assignments
  )
    ? plan.assignments.find(
        (item) =>
          item.studentId ===
          student.id ||
          item.studentId ===
          student.studentId
      )
    : null;


if (!assignment) {

  activeSeatRecord = null;

  seatResult.hidden =
    true;

  formMessage.textContent =
    "No seat has been assigned to you for this examination.";

  formMessage.className =
    "form-message error-message";

  return;
}


/* =========================================================
   BUILD STUDENT SEAT RECORD
   ========================================================= */

const roomPlan =
  Array.isArray(plan.rooms)
    ? plan.rooms.find(
        (room) =>
          room.roomId ===
          assignment.roomId
      )
    : null;


const roomName =
  roomPlan?.roomName ||
  assignment.roomName ||
  assignment.room ||
  "Assigned room";


const seat =
  assignment.seat ||
  assignment.seatNumber ||
  "—";


const roomData =
  roomPlan || null;


/* =========================================================
   BUILD STUDENT SEAT RECORD
   ========================================================= */

activeSeatRecord = {

  studentId:
    student.studentId ||
    student.id,

  studentName:
    student.name ||
    student.studentName,

  exam:
    exam.id,

  examLabel:
    exam.name ||
    "Examination",

  room:
    roomName,

  seat:
    seat,

  roomData:
    roomData

};


/* =========================================================
   DISPLAY RESULT
   ========================================================= */

document.getElementById(
  "resultStudent"
).textContent =
  activeSeatRecord.studentName;


document.getElementById(
  "resultExam"
).textContent =
  activeSeatRecord.examLabel;


document.getElementById(
  "resultRoom"
).textContent =
  `Room ${activeSeatRecord.room}`;


document.getElementById(
  "resultSeat"
).textContent =
  activeSeatRecord.seat;


formMessage.textContent =
  "";

formMessage.className =
  "form-message";


seatResult.hidden =
  false;


});

document.getElementById("viewVisualisation").addEventListener("click", () => {
  if (!activeSeatRecord) return;
  renderSeatMap(activeSeatRecord);
  showStudentView("seat-visualisation");
});
document.getElementById("backToResult").addEventListener(
  "click",
  () => showStudentView("find-my-seat")
);

window.addEventListener(
  "popstate",
  () =>
    showStudentView(
      window.location.hash.slice(1),
      false
    )
);

populateExamSelect();

showStudentView(
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
