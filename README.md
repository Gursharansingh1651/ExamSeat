# Dynamic Exam Seating & Conflict Resolver

A web-based exam seating management system that automatically generates exam hall seating arrangements while enforcing anti-cheating constraints.

The project is designed to reduce the manual effort involved in preparing examination seating plans and to provide administrators with a clear, visual, and conflict-aware seating arrangement.

---

## 🎯 Project Motivation

Creating examination seating arrangements manually becomes difficult and time-consuming when there are:

- Large numbers of students
- Multiple examination rooms
- Rooms with different capacities
- Students from different subjects or sections
- Anti-cheating seating constraints

The goal of this project is to automate this process using a constraint-based seating algorithm.

The system attempts to ensure that students from the same subject and section are not seated adjacent to one another while efficiently distributing students across available rooms.

---

## 🚀 Project Objectives

The main objectives of the project are:

- Automatically generate examination seating arrangements.
- Prevent students from the same subject/section from being seated next to each other.
- Support multiple examination rooms with different capacities.
- Handle overflow when one room cannot accommodate students while satisfying constraints.
- Allow administrators to manage rooms, students, and examinations.
- Import student records through JSON.
- Persist application data using browser LocalStorage in Phase 1.
- Visually distinguish students by subject.
- Detect and report seating conflicts.
- Generate a printable seating arrangement.

---

# 🏗️ Phase 1 — Vanilla JavaScript Prototype

Phase 1 focuses on implementing and validating the core seating algorithm and creating a functional browser-based prototype.

### Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage
- JSON

---

## 👨‍🎓 Student Management

Administrators can:

- Add students manually.
- Store student information locally.
- Import students through a JSON file.
- View imported student records.
- Manage student data before generating seating plans.

### JSON Import

Student records can be imported using a JSON file.

The system:

1. Opens the file picker through the **Import JSON** button.
2. Reads the selected file.
3. Parses the JSON.
4. Validates that the imported data is an array.
5. Stores the student records in LocalStorage.
6. Updates the student list.

---

## 🏫 Room Management

The system supports multiple examination rooms.

Rooms can have different:

- Row counts
- Column counts
- Seating capacities
- Layout configurations

This allows the seating algorithm to distribute students across multiple rooms when required.

---

# 🧠 Seating Algorithm

The core of the project is a constraint-based seating algorithm.

The algorithm generates available seats across the configured rooms and attempts to place students while checking the constraints against already assigned students.

### Current constraints

Students from the same:

- Subject
- Section

should not be seated in adjacent seats.

### Adjacent Seat Definition

The system checks the four direct neighboring positions:

```text
        Front
          ↑
Left ← Student → Right
          ↓
        Back
```

Diagonal seats are not considered adjacent.

For example:

```text
A | B
--+--
C | D
```

A and D are diagonal and therefore do not conflict.

---

## 🔄 Multi-Room Overflow

If students cannot all be placed while satisfying the seating constraints in one room, the system can continue placing students in subsequent rooms.

For example:

```text
Room 1
2 × 2
4 seats

Room 2
2 × 2
4 seats
```

If a valid arrangement cannot accommodate every student in Room 1, remaining students are moved to Room 2.

This allows the system to gracefully handle different room capacities and constraint situations.

---

# ⚠️ Conflict Detection

After generating a seating plan, the system can check the arrangement for adjacency conflicts.

The system identifies:

- Conflicting students
- Room information
- Student IDs
- Type of conflict
- A human-readable conflict message

This provides administrators with feedback when a seating arrangement violates the configured constraints.

---

# 🎨 Subject-Based Color Coding

Generated seating plans use different colors for different subjects.

Current supported subjects include:

- Maths
- DSA
- C++
- Java
- English
- Physics
- BEE

Students belonging to the same subject receive the same visual color, making the seating plan easier to understand at a glance.

Example:

```text
Maths    → Blue
DSA      → Green
C++      → Yellow
Java     → Pink
English  → Cyan
Physics  → Purple
BEE      → Orange
```

The color coding is visual only and does not alter the seating algorithm.

---

# 💾 LocalStorage Persistence

Phase 1 uses browser LocalStorage to persist application data.

The system stores information such as:

- Students
- Examinations
- Rooms
- Seating plans

This allows generated data to remain available after refreshing the page.

---

# 🖨️ Printable Seating Plans

Generated seating arrangements can be printed using the **Print Seating Plan** feature.

The print layout is optimized to:

- Hide dashboard/navigation elements.
- Display the generated seating arrangement clearly.
- Print room-wise seating tables.
- Preserve subject-based colors.
- Use a printer-friendly A4 landscape layout.
- Avoid unnecessary dashboard controls in the printed output.

---

# 🔐 Authentication & User Access

The application includes authentication-based access.

Instead of asking the user to manually select a role, the login credentials determine which interface is displayed.

For example:

```text
Student credentials
       ↓
Student Dashboard


Teacher credentials
       ↓
Teacher Dashboard
```

The project also includes registration functionality and teacher registration verification.

---

# 👩‍🏫 Teacher Dashboard

The teacher/admin interface provides functionality for managing the examination seating workflow, including:

- Student management
- JSON student import
- Room management
- Examination management
- Seating plan generation
- Seating plan regeneration
- Conflict detection
- Subject-based visualization
- Printable seating plans

---

# 📊 Current Phase 1 Status

| Feature | Status |
|---|---|
| Authentication | ✅ Completed |
| Student registration/management | ✅ Completed |
| Teacher registration | ✅ Completed |
| Room management | ✅ Completed |
| Examination management | ✅ Completed |
| JSON student import | ✅ Completed |
| LocalStorage persistence | ✅ Completed |
| Seating algorithm | ✅ Completed |
| Same-subject adjacency prevention | ✅ Completed |
| Same-section adjacency prevention | ✅ Completed |
| Multi-room overflow | ✅ Completed |
| Conflict detection | ✅ Completed |
| Subject color coding | ✅ Completed |
| Printable seating plan | ✅ Completed |

---


# 💡 Why This Project Matters

The project addresses a practical administrative problem faced during examinations.

Instead of manually creating seating arrangements and repeatedly checking for conflicts, administrators can use an automated constraint-based system to generate and manage seating plans.

The project combines:

- Algorithmic problem solving
- Constraint satisfaction
- Web development
- Data management
- Authentication
- Interactive UI
- Database architecture

The final objective is to make examination seating **faster, more reliable, easier to manage, and less error-prone**.

---

# 👥 Project Development

This project is being developed incrementally.

**Phase 1:** Core algorithm + functional browser prototype

**Phase 2:** Full MERN architecture + interactive seating management

The Phase 2 architecture will build on the seating and conflict-resolution logic validated during Phase 1.
## Contributing

Feel free to open issues or pull requests.

## License

This project is provided under the MIT License (or choose a license).
