import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and execute schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

// Clear existing data (in case tables already exist)
const tables = ['events', 'leave_applications', 'notifications', 'marks', 'assignment_submissions', 'assignments', 'attendance_records', 'attendance_sessions', 'timetable', 'subjects', 'users'];
for (const table of tables) {
  try {
    db.exec(`DELETE FROM ${table}`);
  } catch (err) {
    // Ignore error if table doesn't exist yet, though schema.sql should ensure they do
  }
}

// Reset autoincrement
try {
  db.exec("DELETE FROM sqlite_sequence");
} catch (e) {}

// Seed Users
const facultyPassword = bcrypt.hashSync('1234567890', 10);
const studentPassword = bcrypt.hashSync('0987654321', 10);

const insertUser = db.prepare(`INSERT INTO users (email, password_hash, name, role, department) VALUES (?, ?, ?, ?, ?)`);

const facultyRes = insertUser.run('sai_koundru@test.com', facultyPassword, 'Sai Koundru', 'faculty', 'Computer Science');
const facultyId = facultyRes.lastInsertRowid;

const studentRes = insertUser.run('sanjana.sambu@test.com', studentPassword, 'Sanjana Sambu', 'student', 'Computer Science');
const studentId = studentRes.lastInsertRowid;

// Seed Subjects
const insertSubject = db.prepare(`INSERT INTO subjects (name, code, faculty_id, department) VALUES (?, ?, ?, ?)`);
const dsSubj = insertSubject.run('Data Structures', 'CS201', facultyId, 'Computer Science');
const dbSubj = insertSubject.run('Database Systems', 'CS202', facultyId, 'Computer Science');
const webSubj = insertSubject.run('Web Development', 'CS301', facultyId, 'Computer Science');
const osSubj = insertSubject.run('Operating Systems', 'CS303', facultyId, 'Computer Science');

// Seed Timetable
const insertTimetable = db.prepare(`INSERT INTO timetable (subject_id, day_of_week, start_time, end_time, room, department) VALUES (?, ?, ?, ?, ?, ?)`);
insertTimetable.run(dsSubj.lastInsertRowid, 'Monday', '09:00', '10:00', 'Room 101', 'Computer Science');
insertTimetable.run(dbSubj.lastInsertRowid, 'Tuesday', '10:00', '11:00', 'Room 102', 'Computer Science');
insertTimetable.run(webSubj.lastInsertRowid, 'Wednesday', '11:00', '12:00', 'Lab 1', 'Computer Science');
insertTimetable.run(osSubj.lastInsertRowid, 'Thursday', '13:00', '14:00', 'Room 103', 'Computer Science');
insertTimetable.run(dsSubj.lastInsertRowid, 'Friday', '14:00', '15:00', 'Room 101', 'Computer Science');

// Seed Assignments
const insertAssignment = db.prepare(`INSERT INTO assignments (subject_id, faculty_id, title, description, due_date, max_marks) VALUES (?, ?, ?, ?, ?, ?)`);
insertAssignment.run(dsSubj.lastInsertRowid, facultyId, 'Trees and Graphs', 'Implement AVL tree.', new Date(Date.now() + 7*24*60*60*1000).toISOString(), 100);
insertAssignment.run(dbSubj.lastInsertRowid, facultyId, 'SQL Queries', 'Write complex JOINs.', new Date(Date.now() + 10*24*60*60*1000).toISOString(), 50);

// Seed Marks
const insertMarks = db.prepare(`INSERT INTO marks (student_id, subject_id, exam_type, marks_obtained, max_marks) VALUES (?, ?, ?, ?, ?)`);
insertMarks.run(studentId, dsSubj.lastInsertRowid, 'midterm', 85, 100);
insertMarks.run(studentId, dbSubj.lastInsertRowid, 'quiz', 18, 20);

// Seed Notifications
const insertNotification = db.prepare(`INSERT INTO notifications (sender_id, title, message, target_role, department) VALUES (?, ?, ?, ?, ?)`);
insertNotification.run(facultyId, 'Welcome', 'Welcome to the GNITC Portal', 'all', 'Computer Science');
insertNotification.run(facultyId, 'Exam Schedule', 'Midterm exams start next week', 'student', 'Computer Science');

// Seed Events
const insertEvent = db.prepare(`
  INSERT INTO events (title, category, description, event_date, last_date_to_apply, registration_fee, registration_link, venue, organizer, created_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertEvent.run(
  'GNITC Code Sprint 2026', 'hackathon', 'Annual coding hackathon.', 
  new Date(Date.now() + 14*24*60*60*1000).toISOString(), 
  new Date(Date.now() + 10*24*60*60*1000).toISOString(), 
  100, 'http://example.com/register/1', 'Main Auditorium', 'CSE Department', facultyId
);
insertEvent.run(
  'TCS CodeVita', 'hackathon', 'Global coding contest.', 
  new Date(Date.now() + 30*24*60*60*1000).toISOString(), 
  new Date(Date.now() + 25*24*60*60*1000).toISOString(), 
  0, 'http://example.com/tcs', 'Online', 'TCS', facultyId
);
insertEvent.run(
  'Amazon ML Summer School', 'internship', 'Summer school for ML enthusiasts.', 
  new Date(Date.now() + 60*24*60*60*1000).toISOString(), 
  new Date(Date.now() + 45*24*60*60*1000).toISOString(), 
  0, 'http://example.com/amazon', 'Online', 'Amazon', facultyId
);
insertEvent.run(
  'GNITC Cultural Fest - Sargam 2026', 'cultural', 'Annual cultural festival.', 
  new Date(Date.now() + 40*24*60*60*1000).toISOString(), 
  new Date(Date.now() + 35*24*60*60*1000).toISOString(), 
  50, 'http://example.com/sargam', 'College Grounds', 'Cultural Committee', facultyId
);
insertEvent.run(
  'AI/ML Workshop', 'workshop', 'Hands-on AI/ML workshop.', 
  new Date(Date.now() + 20*24*60*60*1000).toISOString(), 
  new Date(Date.now() + 15*24*60*60*1000).toISOString(), 
  200, 'http://example.com/aiml', 'Lab 2', 'AI Club', facultyId
);
insertEvent.run(
  'Campus Recruitment Drive - Infosys', 'seminar', 'Pre-placement talk and recruitment.', 
  new Date(Date.now() + 5*24*60*60*1000).toISOString(), 
  new Date(Date.now() + 2*24*60*60*1000).toISOString(), 
  0, '', 'Seminar Hall', 'Placement Cell', facultyId
);

console.log('Database seeded successfully.');
