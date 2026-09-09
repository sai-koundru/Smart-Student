import express from 'express';
import db from '../db/database.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authorize('student'), (req, res) => {
  try {
    const marks = db.prepare(`
      SELECT m.*, s.name as subject_name, s.code as subject_code
      FROM marks m
      JOIN subjects s ON m.subject_id = s.id
      WHERE m.student_id = ?
    `).all(req.user.id);
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', authorize('faculty'), (req, res) => {
  const marksArray = req.body; // Expects an array of marks
  if (!Array.isArray(marksArray)) return res.status(400).json({ error: 'Expected array of marks' });

  const insert = db.prepare('INSERT INTO marks (student_id, subject_id, exam_type, marks_obtained, max_marks) VALUES (?, ?, ?, ?, ?)');
  
  try {
    db.transaction(() => {
      for (const m of marksArray) {
        insert.run(m.student_id, m.subject_id, m.exam_type, m.marks_obtained, m.max_marks || 100);
      }
    })();
    res.status(201).json({ message: 'Marks saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/subject/:id', authorize('faculty'), (req, res) => {
  try {
    const marks = db.prepare(`
      SELECT m.*, u.name as student_name
      FROM marks m
      JOIN users u ON m.student_id = u.id
      WHERE m.subject_id = ?
    `).all(req.params.id);
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/students', authorize('faculty'), (req, res) => {
  try {
    const students = db.prepare("SELECT id, name, email FROM users WHERE role = 'student'").all();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
