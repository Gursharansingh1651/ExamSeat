# 🎓 ExamSeat 🪑

### Dynamic Exam Seating & Conflict Resolver

Manage exams, rooms, and students — then create seating plans with fewer adjacency conflicts.

✨ **ST2** · 🌐 Vanilla JavaScript · ⚙️ Express · 🍃 MongoDB · 🔑 JWT · 🛡️ bcryptjs

---

## Contents

- [Overview](#overview)
- [Features](#features)
- [How it works](#how-it-works)
- [Get started](#get-started)
- [Accounts and authentication](#accounts-and-authentication)
- [API reference](#api-reference)
- [Try it in Postman](#try-it-in-postman)
- [MongoDB data](#mongodb-data)
- [Project structure](#project-structure)

## Overview

🎯 ExamSeat helps teachers manage examinations and create seating plans that reduce the chance of nearby students sharing both the same subject and section.

The ST2 version keeps the existing HTML, CSS, and Vanilla JavaScript interface and adds a Node.js/Express backend with MongoDB persistence, JWT authentication, and bcrypt password hashing.

> 🧠 **Architecture note**  
> Vanilla JavaScript remains the frontend. Express is the server framework. The seating algorithm still runs in the browser, and the generated plan is saved through the API to MongoDB.

## Features

| Area | What it supports |
| --- | --- |
| 🔐 Accounts | Student and teacher sign-up and login |
| 👨‍🎓 Students | Add, update, delete, list, and import student records from JSON |
| 🏫 Rooms | Standard grid rooms and bench-style rooms with calculated capacities |
| 📝 Examinations | Create and manage exams; assign students and rooms |
| 🗓️ Scheduling | Check for room time conflicts between examinations |
| 🪑 Seating | Generate, review, finalize, and print seating plans |
| 🚦 Conflict checks | Detect adjacency, missing or duplicate students, duplicate seats, invalid rooms, and capacity problems |
| 💾 Persistence | Keep application records in MongoDB across browser sessions |

### 🚫 Seating rule

The algorithm tries to keep students with the **same subject and the same section** apart. It checks the four direct neighbours—front, back, left, and right. Diagonal seats do not count as adjacent.[...]

## How it works

```text
Browser interface                  Express API                    MongoDB
HTML · CSS · Vanilla JS  ──JSON──▶  Auth + application routes ──▶  Stored records
Seating algorithm        ◀────────  JWT-protected responses       Accounts, students,
                                                                   rooms, exams, plans
```

After login, the browser keeps the JWT in Local Storage and sends it with protected API requests. Student, room, examination, and seating-plan data is stored in MongoDB. Local Storage is used for the [...]

## Get started

### ✅ Requirements

- Node.js with npm
- A running MongoDB server, either local MongoDB or a MongoDB Atlas cluster

> 🔎 **MongoDB Compass is a viewer.** It lets you inspect MongoDB data, but it does not start the database server. A local MongoDB service or an available Atlas cluster is needed for ExamSeat to con[...]

### 1️⃣ Install dependencies

Open a terminal in the project folder—the folder containing `package.json`—and run:

```sh
npm install
```

If Windows PowerShell blocks `npm` because of its script execution policy, use:

```powershell
npm.cmd install
```

### 2️⃣ Configure the environment

Create a `.env` file in the project root:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/examseat
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
PORT=3000
TEACHER_REGISTRATION_CODE=choose-a-private-registration-code
```

For Atlas, replace `MONGODB_URI` with the connection string provided by your cluster. Keep `.env` private: do not commit it or share its values.

### 3️⃣ Start MongoDB and ExamSeat

Make sure the local MongoDB service is running, or that your Atlas cluster is available. Then start the app:

```sh
npm start
```

In Windows PowerShell, use `npm.cmd start` if `npm start` is blocked. Keep the terminal open while using the site.

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

To restart the server automatically when server files change, run `npm run dev` (or `npm.cmd run dev` in PowerShell).

### 4️⃣ View the database in Compass

For the local setup above, connect Compass to:

```text
mongodb://localhost:27017
```

The database is named `examseat`. MongoDB creates it when the app first saves a record, such as when you register an account.

## Accounts and authentication

🔐 Use **Create an account** on the login page. Passwords must be at least six characters. Choose `student` or `teacher`; teacher sign-up also requires the code configured in `TEACHER_REGISTRATION_C[...]

- **bcryptjs** hashes passwords before they are stored. The API does not return the password or its hash.
- **JWT** is a signed login token. The browser stores it in Local Storage and sends it with protected requests.
- The token expires after the period configured by `JWT_EXPIRES_IN` (seven days in the example).

Protected requests use this header:

```http
Authorization: Bearer <your-token>
```

## API reference

🌐 Local base URL: `http://localhost:3000`

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | Public | Create a student or teacher account |
| `POST` | `/api/auth/login` | Public | Sign in and receive a JWT |
| `GET` | `/api/auth/me` | Signed in | Get the current account |
| `GET` | `/api/students` | Signed in | List students |
| `POST` | `/api/students` | Teacher | Create a student |
| `PUT` / `DELETE` | `/api/students/:id` | Teacher | Update or delete a student |
| `POST` | `/api/students/import` | Teacher | Import a JSON array of students |
| `GET` | `/api/rooms` | Signed in | List rooms |
| `POST` | `/api/rooms` | Teacher | Create a room |
| `PUT` / `DELETE` | `/api/rooms/:id` | Teacher | Update or delete a room |
| `GET` | `/api/examinations` | Signed in | List examinations |
| `GET` | `/api/examinations/:id` | Signed in | Get one examination |
| `POST` | `/api/examinations` | Teacher | Create an examination |
| `PUT` / `DELETE` | `/api/examinations/:id` | Teacher | Update or delete an examination |
| `PUT` | `/api/examinations/:id/students` | Teacher | Assign student IDs to an examination |
| `PUT` | `/api/examinations/:id/rooms` | Teacher | Assign room IDs to an examination |
| `GET` | `/api/seating-plans` | Signed in | List seating plans |
| `GET` | `/api/seating-plans/:id` | Signed in | Get one seating plan |
| `GET` | `/api/seating-plans/exam/:examId` | Signed in | Get the latest plan for an examination |
| `POST` | `/api/seating-plans` | Teacher | Save a generated plan |
| `PUT` | `/api/seating-plans/:id/finalize` | Teacher | Finalize a plan |
| `DELETE` | `/api/seating-plans/:id` | Teacher | Delete a plan |

All endpoints except sign-up and login require a valid JWT. Both signed-in roles can use the read endpoints; write endpoints require a teacher account. Requests and responses use JSON. Missing or inva[...]

## Try it in Postman

### 1️⃣ Get a token

1. Start the server and create a teacher account in the website using the registration code from `.env`.
2. In Postman, create a **POST** request to `http://localhost:3000/api/auth/login`.
3. Choose **Body → raw → JSON** and enter your account details:

   ```json
   {
     "identifier": "your-teacher-email-or-id",
     "password": "your-password"
   }
   ```

4. Select **Send**. A successful response has status `200` and includes `token` and `account`. Copy only the value of `token` from the response body—without quotation marks.

### 2️⃣ Send a protected request

Create a **GET** request to `http://localhost:3000/api/students`. Under **Authorization**, select **Bearer Token**, paste the token into the **Token** field, and select **Send**. A successful request [...]

### 3️⃣ Test create, read, update, and delete

Keep the teacher token set as **Bearer Token** for each request.

1. Create a **POST** request to `http://localhost:3000/api/students` and send this JSON under **Body → raw → JSON**:

   ```json
   {
     "name": "Postman Test Student",
     "studentId": "TEST-001",
     "subject": "Maths",
     "section": "A",
     "course": "Example Course"
   }
   ```

   A successful request returns status `201`. Copy the new student's `_id` from the response.

2. Send **GET** `http://localhost:3000/api/students` and confirm the test record appears.
3. Send **PUT** `http://localhost:3000/api/students/<copied-id>` with the same JSON (you can change the name). A successful update returns status `200`.
4. Send **DELETE** `http://localhost:3000/api/students/<copied-id>`. A successful delete returns status `200`. Send GET again to confirm the test record is gone.

Use a dummy record for this walkthrough so real student data is not deleted.

### 4️⃣ Check access control

- Send `GET /api/students` without a token: expected status `401`.
- Try a teacher-only write with a student token: expected status `403`.

> 🔒 Keep passwords, JWTs, and `.env` values private. Do not paste them into public chats or reports.

## MongoDB data

🗃️ Mongoose models store accounts, students, rooms, examinations, and seating plans in the database named in `MONGODB_URI`. Account responses omit the password hash. A seating plan stores room la[...]

## Project structure

```text
server/
├── index.js                  Express app, MongoDB connection, static-file hosting
├── middleware/
│   └── auth.js               JWT verification and teacher-role check
├── models/                   Mongoose schemas
└── routes/                   Authentication and application API routes
auth.js                       Browser sign-up/login and JWT storage
teacher.js                    Teacher dashboard and API integration
student.js                    Student portal and API integration
seating-algorithm.js          Browser-side plan generation and checks
index.html                    Login and account registration
teacher.html                  Teacher dashboard
student.html                  Student portal
package.json                  Scripts and dependencies
```

## Development notes

- `npm start` runs `server/index.js`.
- `npm run dev` runs the server with Node's watch mode.
- Seating-plan generation and review run in the browser; the API saves and retrieves plans in MongoDB.
- The `test` script in `package.json` is a placeholder. No automated test suite is configured there.

## Project phases

| Phase | Description |
| --- | --- |
| **ST1** | Browser prototype, seating algorithm, and Local Storage-based persistence |
| **ST2** | Express API, MongoDB/Mongoose persistence, bcrypt password hashing, JWT authentication, and frontend integration with the API |

**The ST2 frontend still uses Vanilla JavaScript; it is not a React application.**
