import express from 'express';
import db from '../db';
import { authenticateToken, requireRole } from '../middleware/auth';
import { logAction } from '../utils/audit';

const router = express.Router();

// Rotas para grupos de adicionais
router.get('/groups', (req, res) => {
  const groups = db.prepare('SELECT * FROM addon_groups ORDER BY sort_order, name').all();
  res.json(groups);
});

router.get('/groups/:id', (req, res) => {
  const group = db.prepare('SELECT * FROM addon_groups WHERE id = ?').get(req.params.id);
  if (!group) {
    return res.sendStatus(404);
  }
  const addons = db.prepare('SELECT * FROM addons WHERE group_id = ? ORDER BY sort_order, name').all(req.params.id);
  res.json({ ...group, addons });
});

router.post('/groups', authenticateToken, requireRole(['admin', 'manager']), (req, res) => {
  const { name, product_id, min_options, max_options, sort_order } = req.body;
  const result = db.prepare(`
    INSERT INTO addon_groups (name, product_id, min_options, max_options, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, product_id, min_options || 0, max_options || 999, sort_order || 0);
  logAction(req.user?.userId || null, 'create', 'addon_group', Number(result.lastInsertRowid), JSON.stringify(req.body));
  res.status(201).json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/groups/:id', authenticateToken, requireRole(['admin', 'manager']), (req, res) => {
  const { name, product_id, min_options, max_options, sort_order } = req.body;
  db.prepare(`
    UPDATE addon_groups 
    SET name = ?, product_id = ?, min_options = ?, max_options = ?, sort_order = ?
    WHERE id = ?
  `).run(name, product_id, min_options, max_options, sort_order, req.params.id);
  logAction(req.user?.userId || null, 'update', 'addon_group', Number(req.params.id), JSON.stringify(req.body));
  res.json({ id: req.params.id, ...req.body });
});

router.delete('/groups/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  db.prepare('DELETE FROM addons WHERE group_id = ?').run(req.params.id);
  db.prepare('DELETE FROM addon_groups WHERE id = ?').run(req.params.id);
  logAction(req.user?.userId || null, 'delete', 'addon_group', Number(req.params.id), null);
  res.sendStatus(204);
});

// Rotas para adicionais
router.get('/', (req, res) => {
  const addons = db.prepare('SELECT * FROM addons ORDER BY sort_order, name').all();
  res.json(addons);
});

router.get('/:id', (req, res) => {
  const addon = db.prepare('SELECT * FROM addons WHERE id = ?').get(req.params.id);
  if (!addon) {
    return res.sendStatus(404);
  }
  res.json(addon);
});

router.post('/', authenticateToken, requireRole(['admin', 'manager']), (req, res) => {
  const { name, price, group_id, available, sort_order } = req.body;
  const result = db.prepare(`
    INSERT INTO addons (name, price, group_id, available, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, price || 0, group_id, available ?? 1, sort_order || 0);
  logAction(req.user?.userId || null, 'create', 'addon', Number(result.lastInsertRowid), JSON.stringify(req.body));
  res.status(201).json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/:id', authenticateToken, requireRole(['admin', 'manager']), (req, res) => {
  const { name, price, group_id, available, sort_order } = req.body;
  db.prepare(`
    UPDATE addons 
    SET name = ?, price = ?, group_id = ?, available = ?, sort_order = ?
    WHERE id = ?
  `).run(name, price, group_id, available, sort_order, req.params.id);
  logAction(req.user?.userId || null, 'update', 'addon', Number(req.params.id), JSON.stringify(req.body));
  res.json({ id: req.params.id, ...req.body });
});

router.delete('/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  db.prepare('DELETE FROM addons WHERE id = ?').run(req.params.id);
  logAction(req.user?.userId || null, 'delete', 'addon', Number(req.params.id), null);
  res.sendStatus(204);
});

export default router;
