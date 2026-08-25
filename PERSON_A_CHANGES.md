# Person A integration - ExamSeat ST1

## What was added

- `seating-algorithm.js` replaces the prototype's sequential allocator.
- It creates legal seats for both supported room types:
  - Standard: `R1-C1`
  - Bench: `R1-B1-P1`
- It returns the plan structure already used by `teacher.js` and `student.js`:
  `rooms[]`, room-level `assignments[]`, and flat `assignments[]`.
- It tries to keep students from the same section apart when seats are adjacent.
- When a constraint cannot be satisfied, the plan is still generated for review and the conflict checker blocks finalization.
- `student.js` no longer has the unused mock seating-data path or duplicate input-normalisation function.

## Existing workflow preserved

1. Teacher creates an examination, students, and rooms.
2. Teacher assigns students and rooms to the examination.
3. Generate Seating Plan calls `ExamSeatSeatingAlgorithm.createPlan(...)`.
4. Teacher review checks structural conflicts plus same-section adjacency.
5. Only a valid plan can be finalized.
6. Students can find their finalized room and seat using the existing student portal.

## Run locally

Open `index.html` in a browser. Browser Local Storage keeps the project data on that browser/device.

## ST1 scope

The project uses HTML, CSS, Vanilla JavaScript, arrays, objects, functions, DOM events and Local Storage only. No backend, database, API, package, or framework is required.
