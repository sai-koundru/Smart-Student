import express from 'express';
import db from '../db/database.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    if (req.user.role === 'faculty') {
      const assignments = db.prepare(`
        SELECT a.*, s.name as subject_name
        FROM assignments a
        JOIN subjects s ON a.subject_id = s.id
        WHERE a.faculty_id = ?
      `).all(req.user.id);
      res.json(assignments);
    } else {
      const assignments = db.prepare(`
        SELECT a.*, s.name as subject_name,
               sub.id as submission_id, sub.marks_obtained, sub.submitted_at
        FROM assignments a
        JOIN subjects s ON a.subject_id = s.id
        LEFT JOIN assignment_submissions sub ON a.id = sub.assignment_id AND sub.student_id = ?
      `).all(req.user.id);
      res.json(assignments);
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', authorize('faculty'), (req, res) => {
  const { subject_id, title, description, due_date, max_marks } = req.body;
  try {
    const insert = db.prepare('INSERT INTO assignments (subject_id, faculty_id, title, description, due_date, max_marks) VALUES (?, ?, ?, ?, ?, ?)');
    const info = insert.run(subject_id, req.user.id, title, description, due_date, max_marks || 100);
    res.status(201).json({ id: info.lastInsertRowid, message: 'Assignment created' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Not found' });
    
    if (req.user.role === 'faculty') {
      const submissions = db.prepare(`
        SELECT sub.*, u.name as student_name
        FROM assignment_submissions sub
        JOIN users u ON sub.student_id = u.id
        WHERE sub.assignment_id = ?
      `).all(req.params.id);
      res.json({ assignment, submissions });
    } else {
      const submission = db.prepare('SELECT * FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?').get(req.params.id, req.user.id);
      res.json({ assignment, submission });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/:id/submit', authorize('student'), (req, res) => {
  const { submission_text } = req.body;
  try {
    const insert = db.prepare('INSERT INTO assignment_submissions (assignment_id, student_id, submission_text) VALUES (?, ?, ?)');
    insert.run(req.params.id, req.user.id, submission_text);
    res.json({ message: 'Assignment submitted' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Already submitted' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

router.put('/submissions/:id/grade', authorize('faculty'), (req, res) => {
  const { marks_obtained, feedback } = req.body;
  try {
    const update = db.prepare('UPDATE assignment_submissions SET marks_obtained=?, feedback=?, graded_at=CURRENT_TIMESTAMP WHERE id=?');
    update.run(marks_obtained, feedback, req.params.id);
    res.json({ message: 'Submission graded' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
