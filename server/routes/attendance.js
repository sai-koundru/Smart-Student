import express from 'express';
import db from '../db/database.js';
import { authorize } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

const router = express.Router();

router.post('/session', authorize('faculty'), async (req, res) => {
  const { subject_id } = req.body;
  if (!subject_id) return res.status(400).json({ error: 'subject_id required' });

  const token = uuidv4();
  const sessionDate = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // 10 minutes

  try {
    const insert = db.prepare('INSERT INTO attendance_sessions (subject_id, faculty_id, qr_token, session_date, expires_at) VALUES (?, ?, ?, ?, ?)');
    const info = insert.run(subject_id, req.user.id, token, sessionDate, expiresAt);
    
    const qrDataUrl = await QRCode.toDataURL(token);
    res.status(201).json({ 
      id: info.lastInsertRowid,
      qr_token: token,
      qr_image: qrDataUrl,
      expires_at: expiresAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating session' });
  }
});

router.post('/mark', authorize('student'), (req, res) => {
  const { qr_token } = req.body;
  if (!qr_token) return res.status(400).json({ error: 'qr_token required' });

  try {
    const session = db.prepare('SELECT id, expires_at, is_active FROM attendance_sessions WHERE qr_token = ?').get(qr_token);
    if (!session || !session.is_active) {
      return res.status(400).json({ error: 'Invalid or inactive session' });
    }
    
    if (new Date() > new Date(session.expires_at)) {
      return res.status(400).json({ error: 'Session expired' });
    }

    const insert = db.prepare('INSERT INTO attendance_records (session_id, student_id) VALUES (?, ?)');
    insert.run(session.id, req.user.id);
    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Attendance already marked' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

router.get('/history', authorize('student'), (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT s.id, s.name as subject_name, s.code,
             COUNT(DISTINCT asess.id) as total_sessions,
             COUNT(ar.id) as present_count
      FROM subjects s
      LEFT JOIN attendance_sessions asess ON s.id = asess.subject_id
      LEFT JOIN attendance_records ar ON asess.id = ar.session_id AND ar.student_id = ?
      GROUP BY s.id
    `).all(req.user.id);
    
    const result = stats.map(st => ({
      ...st,
      percentage: st.total_sessions > 0 ? ((st.present_count / st.total_sessions) * 100).toFixed(2) : 0
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/session/:id/records', authorize('faculty'), (req, res) => {
  try {
    const records = db.prepare(`
      SELECT ar.*, u.name as student_name, u.email
      FROM attendance_records ar
      JOIN users u ON ar.student_id = u.id
      WHERE ar.session_id = ?
    `).all(req.params.id);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
