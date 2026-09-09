# 📱 Smart Student – Integrated Student Management App

A full-stack web application that unifies student academic workflows — login, timetable, attendance (QR-based), assignments, marks, and notifications — into a single platform with separate dashboards for **Students** and **Faculty**.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, React Router v6, Lucide Icons
- **Backend**: Node.js, Express.js, SQLite (better-sqlite3), JWT Auth
- **QR Attendance**: qrcode (generate) + html5-qrcode (scan)

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

## Quick Start

### 1. Install all dependencies
```bash
# From the project root (smart-student/)
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Seed the database with demo data
```bash
cd server
node db/seed.js
cd ..
```

### 3. Start the app (backend + frontend)
```bash
npm run dev
```

This starts:
- **Backend** on http://localhost:3001
- **Frontend** on http://localhost:5173

### 4. Login with demo accounts

| Role | Email | Password |
|------|-------|----------|
| Faculty | prof.sharma@university.edu | password123 |
| Faculty | prof.kumar@university.edu | password123 |
| Student | rahul@student.edu | password123 |
| Student | priya@student.edu | password123 |
| Student | amit@student.edu | password123 |
| Student | neha@student.edu | password123 |
| Student | vikram@student.edu | password123 |

## Features

### 🎓 Student Dashboard
- **Timetable** — Weekly grid view with color-coded subjects
- **Attendance** — Scan QR codes via camera, view subject-wise attendance %
- **Assignments** — View, submit, and track assignment grades
- **Marks** — Subject-wise marks with bar chart visualization
- **Notifications** — Inbox-style notification feed

### 👨‍🏫 Faculty Dashboard
- **Manage Timetable** — Add/edit/delete schedule entries
- **Take Attendance** — Generate time-limited QR codes, view who scanned
- **Manage Assignments** — Create assignments, view submissions, grade them
- **Enter Marks** — Bulk marks entry per subject and exam type
- **Send Notifications** — Broadcast to students by role/department

## Project Structure

```
smart-student/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── api/            # Axios instance with JWT interceptor
│       ├── components/     # Layout, Navbar, ProtectedRoute, StatCard
│       ├── context/        # AuthContext provider
│       └── pages/
│           ├── student/    # 6 student pages
│           └── faculty/    # 6 faculty pages
├── server/                 # Express backend
│   ├── db/                 # SQLite schema, seed, connection
│   ├── middleware/         # JWT auth + role authorization
│   └── routes/             # REST API routes
└── package.json            # Root scripts (concurrently)
```

## API Endpoints

| Group | Endpoints |
|-------|-----------|
| Auth | POST /api/auth/register, /login, GET /me |
| Timetable | GET, POST, PUT, DELETE /api/timetable |
| Attendance | POST /session, /mark, GET /history, /session/:id/records |
| Assignments | GET, POST /api/assignments, POST /:id/submit, PUT /submissions/:id/grade |
| Marks | GET /api/marks, POST (bulk), GET /subject/:id, /students |
| Notifications | GET, POST /api/notifications |

## License

MIT
