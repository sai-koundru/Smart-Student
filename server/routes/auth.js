import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password, name, role, department } = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hash = bcrypt.hashSync(password, 10);
    const insert = db.prepare('INSERT INTO users (email, password_hash, name, role, department) VALUES (?, ?, ?, ?, ?)');
    const info = insert.run(email, hash, name, role, department || 'Computer Science');
    
    const user = { id: info.lastInsertRowid, email, name, role, department: department || 'Computer Science' };
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.status(201).json({ token, user });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const userPayload = { id: user.id, email: user.email, name: user.name, role: user.role, department: user.department };
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  res.json({ token, user: userPayload });
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
