import express from 'express';
import db from '../db';
import { authenticateToken, requireRole } from '../middleware/auth';
import { logAction } from '../utils/audit';

const router = express.Router();

router.get('/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order, name').all();
  res.json(categories);
});

router.post('/categories', authenticateToken, requireRole(['admin', 'manager']), (req, res) => {
  const { name, sort_order } = req.body;
  const result = db.prepare('INSERT INTO categories (name, sort_order) VALUES (?, ?)').run(name, sort_order || 0);
  logAction(req.user?.userId || null, 'create', 'category', Number(result.lastInsertRowid), JSON.stringify(req.body));
  res.status(201).json({ id: result.lastInsertRowid, name, sort_order });
});

router.put('/categories/:id', authenticateToken, requireRole(['admin', 'manager']), (req, res) => {
  const { name, sort_order } = req.body;
  db.prepare('UPDATE categories SET name = ?, sort_order = ? WHERE id = ?').run(name, sort_order, req.params.id);
  logAction(req.user?.userId || null, 'update', 'category', Number(req.params.id), JSON.stringify(req.body));
  res.json({ id: req.params.id, name, sort_order });
});

router.delete('/categories/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  logAction(req.user?.userId || null, 'delete', 'category', Number(req.params.id), null);
  res.sendStatus(204);
});

router.get('/', (req, res) => {
  const products = db.prepare(`
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    ORDER BY p.name
  `).all();
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = db.prepare(`
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.id = ?
  `).get(req.params.id);
  if (!product) {
    return res.sendStatus(404);
  }
  res.json(product);
});

router.post('/', authenticateToken, requireRole(['admin', 'manager']), (req, res) => {
  const { name, description, price, category_id, available, image_url, allergens } = req.body;
  const result = db.prepare(`
    INSERT INTO products (name, description, price, category_id, available, image_url, allergens)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, description, price, category_id, available ?? 1, image_url, allergens);
  logAction(req.user?.userId || null, 'create', 'product', Number(result.lastInsertRowid), JSON.stringify(req.body));
  res.status(201).json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/:id', authenticateToken, requireRole(['admin', 'manager']), (req, res) => {
  const { name, description, price, category_id, available, image_url, allergens } = req.body;
  db.prepare(`
    UPDATE products 
    SET name = ?, description = ?, price = ?, category_id = ?, available = ?, image_url = ?, allergens = ?
    WHERE id = ?
  `).run(name, description, price, category_id, available, image_url, allergens, req.params.id);
  logAction(req.user?.userId || null, 'update', 'product', Number(req.params.id), JSON.stringify(req.body));
  res.json({ id: req.params.id, ...req.body });
});

router.delete('/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  logAction(req.user?.userId || null, 'delete', 'product', Number(req.params.id), null);
  res.sendStatus(204);
});

export default router;
