import express from 'express';
import db from '../db/database.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { role, department } = req.user;
    const notifications = db.prepare(`
      SELECT n.*, u.name as sender_name
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.id
      WHERE (n.target_role = 'all' OR n.target_role = ?)
        AND (n.department IS NULL OR n.department = ?)
      ORDER BY n.created_at DESC
    `).all(role, department);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', authorize('faculty'), (req, res) => {
  const { title, message, target_role, department } = req.body;
  try {
    const insert = db.prepare('INSERT INTO notifications (sender_id, title, message, target_role, department) VALUES (?, ?, ?, ?, ?)');
    const info = insert.run(req.user.id, title, message, target_role || 'all', department || null);
    res.status(201).json({ id: info.lastInsertRowid, message: 'Notification created' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
