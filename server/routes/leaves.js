import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// PUBLIC routes (no auth) - parent approval
router.get('/parent/:code', (req, res) => {
  try {
    const leave = db.prepare(`
      SELECT l.*, u.name as student_name
      FROM leave_applications l
      JOIN users u ON l.student_id = u.id
      WHERE l.parent_code = ?
    `).get(req.params.code);

    if (!leave) {
      return res.status(404).json({ error: 'Leave application not found or invalid code' });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/parent', (req, res) => {
  try {
    const { parent_code, status, remarks } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const leave = db.prepare(`SELECT * FROM leave_applications WHERE id = ? AND parent_code = ?`).get(req.params.id, parent_code);

    if (!leave) {
      return res.status(404).json({ error: 'Leave application not found or invalid parent code' });
    }

    db.prepare(`
      UPDATE leave_applications 
      SET parent_status = ?, parent_remarks = ?
      WHERE id = ? AND parent_code = ?
    `).run(status, remarks, req.params.id, parent_code);

    res.json({ message: 'Parent status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// AUTHENTICATED routes
router.use(authenticate);

// Student submits leave
router.post('/', (req, res) => {
  try {
    const { leave_date, leave_end_date, reason } = req.body;
    
    if (!leave_date || !leave_end_date || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const parent_code = uuidv4();
    
    const result = db.prepare(`
      INSERT INTO leave_applications (student_id, leave_date, leave_end_date, reason, parent_code)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.user.id, leave_date, leave_end_date, reason, parent_code);

    const newLeave = db.prepare(`SELECT * FROM leave_applications WHERE id = ?`).get(result.lastInsertRowid);
    
    res.status(201).json(newLeave);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Student views own leaves
router.get('/', (req, res) => {
  try {
    const leaves = db.prepare(`
      SELECT l.*, t.name as teacher_name
      FROM leave_applications l
      LEFT JOIN users t ON l.teacher_id = t.id
      WHERE l.student_id = ?
      ORDER BY l.created_at DESC
    `).all(req.user.id);
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Faculty gets pending leave requests
router.get('/pending', authorize('faculty'), (req, res) => {
  try {
    const leaves = db.prepare(`
      SELECT l.*, u.name as student_name
      FROM leave_applications l
      JOIN users u ON l.student_id = u.id
      WHERE l.teacher_status = 'pending'
      ORDER BY l.created_at ASC
    `).all();
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Faculty approves/rejects
router.put('/:id/teacher', authorize('faculty'), (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = db.prepare(`
      UPDATE leave_applications 
      SET teacher_status = ?, teacher_remarks = ?, teacher_id = ?
      WHERE id = ?
    `).run(status, remarks, req.user.id, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Leave application not found' });
    }

    res.json({ message: 'Teacher status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
