import { Router } from 'express';
import db from '../db/database.js';
import { authorize } from '../middleware/auth.js';

const router = Router();

// Get all events
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    
    let query = `
      SELECT e.*, u.name as creator_name 
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
    `;
    const params = [];

    if (category) {
      query += ` WHERE e.category = ?`;
      params.push(category);
    }

    query += ` ORDER BY e.event_date ASC`;

    const events = db.prepare(query).all(...params);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create event (faculty only)
router.post('/', authorize('faculty'), (req, res) => {
  try {
    const { title, category, description, event_date, last_date_to_apply, registration_fee, registration_link, venue, organizer } = req.body;

    if (!title || !category || !description || !event_date || !last_date_to_apply) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = db.prepare(`
      INSERT INTO events (title, category, description, event_date, last_date_to_apply, registration_fee, registration_link, venue, organizer, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, category, description, event_date, last_date_to_apply, 
      registration_fee || 0, registration_link || '', venue || '', organizer || '', req.user.id
    );

    const newEvent = db.prepare(`SELECT * FROM events WHERE id = ?`).get(result.lastInsertRowid);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update event (faculty only)
router.put('/:id', authorize('faculty'), (req, res) => {
  try {
    const { title, category, description, event_date, last_date_to_apply, registration_fee, registration_link, venue, organizer } = req.body;

    const result = db.prepare(`
      UPDATE events 
      SET title = COALESCE(?, title),
          category = COALESCE(?, category),
          description = COALESCE(?, description),
          event_date = COALESCE(?, event_date),
          last_date_to_apply = COALESCE(?, last_date_to_apply),
          registration_fee = COALESCE(?, registration_fee),
          registration_link = COALESCE(?, registration_link),
          venue = COALESCE(?, venue),
          organizer = COALESCE(?, organizer)
      WHERE id = ?
    `).run(title, category, description, event_date, last_date_to_apply, registration_fee, registration_link, venue, organizer, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const updatedEvent = db.prepare(`SELECT * FROM events WHERE id = ?`).get(req.params.id);
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete event (faculty only)
router.delete('/:id', authorize('faculty'), (req, res) => {
  try {
    const result = db.prepare(`DELETE FROM events WHERE id = ?`).run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
