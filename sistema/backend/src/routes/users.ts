import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db';
import { authenticateToken, requireRole } from '../middleware/auth';
import { logAction } from '../utils/audit';

const router = express.Router();

router.get('/', authenticateToken, requireRole(['admin']), (req, res) => {
  const users = db.prepare('SELECT id, name, email, role, created_at FROM users').all();
  res.json(users);
});

router.post('/', authenticateToken, requireRole(['admin']), (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  ).run(name, email, hashedPassword, role);
  logAction(req.user?.userId || null, 'create', 'user', Number(result.lastInsertRowid), JSON.stringify({ name, email, role }));
  res.status(201).json({ id: result.lastInsertRowid, name, email, role });
});

router.put('/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  const { name, email, role, password } = req.body;
  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare(
      'UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?'
    ).run(name, email, role, hashedPassword, req.params.id);
  } else {
    db.prepare(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?'
    ).run(name, email, role, req.params.id);
  }
  logAction(req.user?.userId || null, 'update', 'user', Number(req.params.id), JSON.stringify(req.body));
  res.json({ id: req.params.id, name, email, role });
});

router.delete('/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  logAction(req.user?.userId || null, 'delete', 'user', Number(req.params.id), null);
  res.sendStatus(204);
});

export default router;
