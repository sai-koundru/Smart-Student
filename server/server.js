import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticate } from './middleware/auth.js';
import db from './db/database.js';

import authRoutes from './routes/auth.js';
import timetableRoutes from './routes/timetable.js';
import attendanceRoutes from './routes/attendance.js';
import assignmentRoutes from './routes/assignments.js';
import marksRoutes from './routes/marks.js';
import notificationRoutes from './routes/notifications.js';
import leavesRoutes from './routes/leaves.js';
import eventsRoutes from './routes/events.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Auto-seed on first startup (for cloud deployment)
try {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    console.log('No users found. Auto-seeding database...');
    const { execSync } = await import('child_process');
    execSync('node db/seed.js', { cwd: __dirname, stdio: 'inherit' });
    console.log('Auto-seed complete.');
  }
} catch (e) {
  console.log('Tables not found. Running schema + seed...');
  const fs = await import('fs');
  const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf-8');
  db.exec(schema);
  const { execSync } = await import('child_process');
  execSync('node db/seed.js', { cwd: __dirname, stdio: 'inherit' });
  console.log('Schema + seed complete.');
}

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/timetable', authenticate, timetableRoutes);
app.use('/api/attendance', authenticate, attendanceRoutes);
app.use('/api/assignments', authenticate, assignmentRoutes);
app.use('/api/marks', authenticate, marksRoutes);
app.use('/api/notifications', authenticate, notificationRoutes);
app.use('/api/leaves', leavesRoutes);
app.use('/api/events', authenticate, eventsRoutes);

// Serve built frontend in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientDist, 'index.html'));
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`GNITC Portal server running on port ${PORT}`);
  console.log(`Local:   http://localhost:${PORT}`);
});
