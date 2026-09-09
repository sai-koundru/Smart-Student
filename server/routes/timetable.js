import express from 'express';
import db from '../db/database.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { department } = req.query;
  let query = `
    SELECT t.id, t.day_of_week, t.start_time, t.end_time, t.room, t.department,
           s.name as subject_name, s.code as subject_code
    FROM timetable t
    JOIN subjects s ON t.subject_id = s.id
  `;
  const params = [];
  
  if (department) {
    query += ' WHERE t.department = ?';
    params.push(department);
  }

  const entries = db.prepare(query).all(...params);
  res.json(entries);
});

router.post('/', authorize('faculty'), (req, res) => {
  const { subject_id, day_of_week, start_time, end_time, room, department } = req.body;
  try {
    const insert = db.prepare('INSERT INTO timetable (subject_id, day_of_week, start_time, end_time, room, department) VALUES (?, ?, ?, ?, ?, ?)');
    const info = insert.run(subject_id, day_of_week, start_time, end_time, room, department || 'Computer Science');
    res.status(201).json({ id: info.lastInsertRowid, message: 'Timetable entry created' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/:id', authorize('faculty'), (req, res) => {
  const { id } = req.params;
  const { subject_id, day_of_week, start_time, end_time, room, department } = req.body;
  try {
    const update = db.prepare('UPDATE timetable SET subject_id=?, day_of_week=?, start_time=?, end_time=?, room=?, department=? WHERE id=?');
    update.run(subject_id, day_of_week, start_time, end_time, room, department, id);
    res.json({ message: 'Timetable entry updated' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/:id', authorize('faculty'), (req, res) => {
  try {
    db.prepare('DELETE FROM timetable WHERE id=?').run(req.params.id);
    res.json({ message: 'Timetable entry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
