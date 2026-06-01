import express from 'express';
import db from '../db';
import { authenticateToken, requireRole } from '../middleware/auth';
import { logAction } from '../utils/audit';

interface Product {
  category_id: number | string;
  category: string;
  image_url: string;
  created_at: string | Date;
  updated_at: string | Date;
  [key: string]: unknown;
}

interface Addon {
  [key: string]: unknown;
}

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
    SELECT p.*, c.name as category 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    ORDER BY p.name
  `).all() as Product[];
  
  // Converter para camelCase e manter compatibilidade com dashboard
  const productsCamel = products.map((product) => ({
    ...product,
    categoryId: product.category_id,
    category_id: product.category_id,
    category_name: product.category,
    imageUrl: product.image_url,
    image_url: product.image_url,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }));
  
  res.json(productsCamel);
});

router.get('/:id', (req, res) => {
  const product = db.prepare(`
    SELECT p.*, c.name as category 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.id = ?
  `).get(req.params.id) as Product | undefined;
  if (!product) {
    return res.sendStatus(404);
  }

  // Converter product para camelCase e manter compatibilidade com dashboard
  const productCamel = {
    ...product,
    categoryId: product.category_id,
    category_id: product.category_id,
    category_name: product.category,
    imageUrl: product.image_url,
    image_url: product.image_url,
    createdAt: product.created_at,
    updatedAt: product.updated_at
  };

  // Buscar grupos de adicionais
  const addonGroups = db.prepare(`
    SELECT * FROM addon_groups 
    WHERE product_id = ? 
    ORDER BY sort_order, id
  `).all(req.params.id) as any[];

  // Buscar adicionais para cada grupo e converter para camelCase
  const groupsWithAddons = addonGroups.map(group => {
    const addons = db.prepare(`
      SELECT * FROM addons 
      WHERE group_id = ? AND available = 1
      ORDER BY sort_order, id
    `).all(group.id) as Addon[];
    
    const addonsCamel = addons.map(addon => {
      const { group_id, sort_order, created_at, ...rest } = addon as any;
      return {
        ...rest,
        groupId: addon.group_id,
        sortOrder: addon.sort_order,
        createdAt: addon.created_at
      };
    });

    return {
      ...group,
      productId: group.product_id,
      minOptions: group.min_options,
      maxOptions: group.max_options,
      sortOrder: group.sort_order,
      createdAt: group.created_at,
      addons: addonsCamel
    };
  }).map(({ product_id, min_options, max_options, sort_order, created_at, ...rest }) => rest);

  res.json({ ...productCamel, addonGroups: groupsWithAddons });
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
