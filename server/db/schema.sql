CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('student','faculty')) NOT NULL,
  department TEXT DEFAULT 'Computer Science',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  faculty_id INTEGER REFERENCES users(id),
  department TEXT DEFAULT 'Computer Science'
);

CREATE TABLE IF NOT EXISTS timetable (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER REFERENCES subjects(id),
  day_of_week TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  room TEXT,
  department TEXT DEFAULT 'Computer Science'
);

CREATE TABLE IF NOT EXISTS attendance_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER REFERENCES subjects(id),
  faculty_id INTEGER REFERENCES users(id),
  qr_token TEXT UNIQUE NOT NULL,
  session_date DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER REFERENCES attendance_sessions(id),
  student_id INTEGER REFERENCES users(id),
  marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'present',
  UNIQUE(session_id, student_id)
);

CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER REFERENCES subjects(id),
  faculty_id INTEGER REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATETIME NOT NULL,
  max_marks INTEGER DEFAULT 100,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id INTEGER REFERENCES assignments(id),
  student_id INTEGER REFERENCES users(id),
  submission_text TEXT,
  marks_obtained INTEGER,
  feedback TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  graded_at DATETIME,
  UNIQUE(assignment_id, student_id)
);

CREATE TABLE IF NOT EXISTS marks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER REFERENCES users(id),
  subject_id INTEGER REFERENCES subjects(id),
  exam_type TEXT CHECK(exam_type IN ('midterm','final','quiz','internal')) NOT NULL,
  marks_obtained INTEGER NOT NULL,
  max_marks INTEGER DEFAULT 100,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_role TEXT DEFAULT 'all',
  department TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leave_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER REFERENCES users(id) NOT NULL,
  leave_date TEXT NOT NULL,
  leave_end_date TEXT NOT NULL,
  reason TEXT NOT NULL,
  teacher_status TEXT DEFAULT 'pending' CHECK(teacher_status IN ('pending','approved','rejected')),
  parent_status TEXT DEFAULT 'pending' CHECK(parent_status IN ('pending','approved','rejected')),
  teacher_remarks TEXT,
  parent_remarks TEXT,
  teacher_id INTEGER REFERENCES users(id),
  parent_code TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT CHECK(category IN ('hackathon','internship','cultural','workshop','seminar','sports')) NOT NULL,
  description TEXT NOT NULL,
  event_date TEXT NOT NULL,
  last_date_to_apply TEXT NOT NULL,
  registration_fee REAL DEFAULT 0,
  registration_link TEXT,
  venue TEXT,
  organizer TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
