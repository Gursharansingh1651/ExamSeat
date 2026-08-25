"use strict";

/* Person A's ST1 seating engine: arrays, objects, loops and functions only. */
const ExamSeatSeatingAlgorithm = (function () {
  function getRoomCapacity(room) {
    if (Number(room.capacity) > 0) return Number(room.capacity);
    if (room.type === "standard") return Number(room.rows) * Number(room.columns);
    return Number(room.rows) * Number(room.benchesPerRow) * Number(room.studentsPerBench || 2);
  }

  function buildRoomSeats(room) {
    const seats = [];
    if (room.type === "standard") {
      for (let row = 1; row <= Number(room.rows); row += 1) {
        for (let column = 1; column <= Number(room.columns); column += 1) {
          seats.push({ roomId: room.id, row: row, column: column, seat: `R${row}-C${column}` });
        }
      }
    } else {
      for (let row = 1; row <= Number(room.rows); row += 1) {
        for (let bench = 1; bench <= Number(room.benchesPerRow); bench += 1) {
          for (let position = 1; position <= Number(room.studentsPerBench || 2); position += 1) {
            seats.push({ roomId: room.id, row: row, bench: bench, position: position, seat: `R${row}-B${bench}-P${position}` });
          }
        }
      }
    }
    return seats;
  }

  function areSeatsAdjacent(first, second, room) {
    if (first.roomId !== second.roomId) return false;
    if (room.type === "standard") {
      return Math.abs(first.row - second.row) + Math.abs(first.column - second.column) === 1;
    }
    const sameBench = first.row === second.row && first.bench === second.bench && first.position !== second.position;
    const neighbouringBench = first.row === second.row && Math.abs(first.bench - second.bench) === 1 && first.position === second.position;
    const seatInRowAheadOrBehind = Math.abs(first.row - second.row) === 1 && first.bench === second.bench && first.position === second.position;
    return sameBench || neighbouringBench || seatInRowAheadOrBehind;
  }

  function sameSection(firstStudent, secondStudent) {
    return Boolean(firstStudent.section && secondStudent.section && firstStudent.section.trim().toLowerCase() === secondStudent.section.trim().toLowerCase());
  }

  function sameSubject(firstStudent, secondStudent) {
  return Boolean(
    firstStudent.subject &&
    secondStudent.subject &&
    firstStudent.subject.trim().toLowerCase() ===
      secondStudent.subject.trim().toLowerCase()
  );
}

  function createPlan(exam, students, rooms) {
    const remainingStudents = students.slice().sort(function (first, second) {
      return String(first.section || "").localeCompare(String(second.section || "")) || String(first.name).localeCompare(String(second.name));
    });
    const roomById = {};
    const roomPlans = rooms.map(function (room) {
      roomById[room.id] = room;
      return { roomId: room.id, roomName: room.name, type: room.type, rows: Number(room.rows), columns: Number(room.columns || 0), benchesPerRow: Number(room.benchesPerRow || 0), studentsPerBench: Number(room.studentsPerBench || 2), capacity: getRoomCapacity(room), assignments: [] };
    });
    const roomPlanById = {};
    roomPlans.forEach(function (roomPlan) { roomPlanById[roomPlan.roomId] = roomPlan; });
    const internalAssignments = [];

    const allSeats = [];

rooms.forEach(function (room) {

  buildRoomSeats(room).forEach(function (seat) {

    allSeats.push(
      Object.assign(
        {},
        seat
      )
    );

  });

});


function conflictsWithAssignedStudent(
  seat,
  student,
  assignments
) {

  for (
    let index = 0;
    index < assignments.length;
    index += 1
  ) {

    const assignment =
      assignments[index];


    if (
      areSeatsAdjacent(
        seat,
        assignment,
        roomById[
          assignment.roomId
        ]
      ) &&
      sameSection(
        student,
        assignment.student
      ) &&
      sameSubject(
        student,
        assignment.student
      )
    ) {

      return true;

    }

  }


  return false;

}


const studentsToPlace =
  students.slice();


function tryAssignStudent(
  studentIndex
) {

  if (
    studentIndex >=
    studentsToPlace.length
  ) {

    return true;

  }


  const student =
    studentsToPlace[
      studentIndex
    ];


  for (
    let seatIndex = 0;
    seatIndex < allSeats.length;
    seatIndex += 1
  ) {

    const seat =
      allSeats[seatIndex];


    const alreadyUsed =
      internalAssignments.some(
        function (assignment) {

          return (
            assignment.roomId ===
              seat.roomId &&
            assignment.seat ===
              seat.seat
          );

        }
      );


    if (alreadyUsed) {

      continue;

    }


    if (
      conflictsWithAssignedStudent(
        seat,
        student,
        internalAssignments
      )
    ) {

      continue;

    }


    const assignment = Object.assign({}, seat, {
  studentId: student.id,
  studentName: student.name,
  studentNumber: student.studentId,
  subject: student.subject,
  student: student
});


    internalAssignments.push(
      assignment
    );


    if (
      tryAssignStudent(
        studentIndex + 1
      )
    ) {

      return true;

    }


    internalAssignments.pop();

  }


  return false;

}


const seatingSuccessful =
  tryAssignStudent(0);


if (seatingSuccessful) {

  internalAssignments.forEach(
    function (assignment) {

      const roomPlan =
        roomPlanById[
          assignment.roomId
        ];


      if (!roomPlan) {

        return;

      }


      roomPlan.assignments.push(
        Object.assign(
          {},
          assignment
        )
      );

    }
  );

}


const assignedStudentIds =
  internalAssignments.map(
    function (assignment) {

      return assignment.studentId;

    }
  );


const unassignedStudentIds =
  students
    .filter(
      function (student) {

        return !assignedStudentIds.includes(
          student.id
        );

      }
    )
    .map(
      function (student) {

        return student.id;

      }
    );



    const assignments = internalAssignments.map(function (assignment) {
      const flat = Object.assign({}, assignment, { roomName: roomPlanById[assignment.roomId].roomName });
      delete flat.student;
      return flat;
    });
    roomPlans.forEach(function (roomPlan) { roomPlan.assignments.forEach(function (assignment) { delete assignment.student; }); });

    return {
      id: `plan-${exam.id}`,
      examId: exam.id,
      status: "Generated",
      generatedAt: new Date().toISOString(),
      studentCount: students.length,
      capacity: rooms.reduce(function (total, room) { return total + getRoomCapacity(room); }, 0),
      constraints: {
  avoidSameSectionAdjacency: true,
  avoidSameSubjectAdjacency: true
},
      rooms: roomPlans,
      assignments: assignments,
      unassignedStudentIds: unassignedStudentIds
    };
  }

  function findSectionAdjacencyConflicts(plan, students, rooms) {
    if (!plan || !plan.constraints || !plan.constraints.avoidSameSectionAdjacency) return [];
    const studentById = {};
    const roomById = {};
    students.forEach(function (student) { studentById[student.id] = student; });
    rooms.forEach(function (room) { roomById[room.id] = room; });
    const assignments = Array.isArray(plan.assignments) ? plan.assignments : [];
    const conflicts = [];
    for (let firstIndex = 0; firstIndex < assignments.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < assignments.length; secondIndex += 1) {
        const first = assignments[firstIndex];
        const second = assignments[secondIndex];
        const room = roomById[first.roomId];
        if (
  room &&
  areSeatsAdjacent(
    first,
    second,
    room
  ) &&
  sameSection(
    studentById[first.studentId] || {},
    studentById[second.studentId] || {}
  ) &&
  sameSubject(
    studentById[first.studentId] || {},
    studentById[second.studentId] || {}
  )
) {
          conflicts.push({ type: "section-adjacency", roomId: first.roomId, firstStudentId: first.studentId, secondStudentId: second.studentId, message: `${first.studentName} and ${second.studentName} from the same section and subject are seated next to each other.` });
        }
      }
    }
    return conflicts;
  }

  return { createPlan: createPlan, findSectionAdjacencyConflicts: findSectionAdjacencyConflicts };
})();
