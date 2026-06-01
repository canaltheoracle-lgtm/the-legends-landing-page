import express from 'express';
import db from '../db';
import { authenticateToken, requireRole } from '../middleware/auth';
import { logAction } from '../utils/audit';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const { status, startDate, endDate } = req.query;
  let query = 'SELECT * FROM orders WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (startDate) {
    query += ' AND created_at >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND created_at <= ?';
    params.push(endDate);
  }

  query += ' ORDER BY created_at DESC';
  const orders = db.prepare(query).all(...params);

  const ordersWithItems = orders.map((order: any) => {
    const items = db.prepare(`
      SELECT oi.*, p.name as product_name 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `).all(order.id).map((item: any) => {
      const addons = db.prepare('SELECT * FROM order_item_addons WHERE order_item_id = ?').all(item.id);
      return { ...item, addons };
    });
    return { ...order, items };
  });

  res.json(ordersWithItems);
});

router.get('/stats', authenticateToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const pending = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').get('received') as { count: number };
  const todayOrders = db.prepare('SELECT COUNT(*) as count, SUM(total) as total FROM orders WHERE DATE(created_at) = ?').get(today) as { count: number; total: number | null };
  
  res.json({
    pendingOrders: pending.count,
    todayOrders: todayOrders.count,
    todayRevenue: todayOrders.total || 0,
  });
});

router.get('/:id', authenticateToken, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;
  if (!order) {
    return res.sendStatus(404);
  }

  const items = db.prepare(`
    SELECT oi.*, p.name as product_name 
    FROM order_items oi 
    JOIN products p ON oi.product_id = p.id 
    WHERE oi.order_id = ?
  `).all(order.id).map((item: any) => {
    const addons = db.prepare('SELECT * FROM order_item_addons WHERE order_item_id = ?').all(item.id);
    return { ...item, addons };
  });

  res.json({ ...order, items });
});

router.post('/', (req, res) => {
  const { 
    customer_name, customer_phone, customer_address, payment_method, notes, items,
    customerName, customerPhone, customerAddress, paymentMethod
  } = req.body;
  
  const finalCustomerName = customerName || customer_name;
  const finalCustomerPhone = customerPhone || customer_phone;
  const finalCustomerAddress = customerAddress || customer_address;
  const finalPaymentMethod = paymentMethod || payment_method;
  
  // Calcular total incluindo adicionais
  const total = items.reduce((sum: number, item: any) => {
    let itemTotal = item.price * item.quantity;
    if (item.addons) {
      itemTotal += item.addons.reduce((addonSum: number, addon: any) => addonSum + addon.price * item.quantity, 0);
    }
    return sum + itemTotal;
  }, 0);
  
  const result = db.prepare(`
    INSERT INTO orders (customer_name, customer_phone, customer_address, total, payment_method, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(finalCustomerName, finalCustomerPhone, finalCustomerAddress, total, finalPaymentMethod, notes);

  const orderId = Number(result.lastInsertRowid);
  items.forEach((item: any) => {
    const itemResult = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price, observation) VALUES (?, ?, ?, ?, ?)')
      .run(orderId, item.productId || item.product_id, item.quantity, item.price, item.observation || '');
    
    const orderItemId = Number(itemResult.lastInsertRowid);
    
    // Inserir adicionais do item
    if (item.addons && item.addons.length > 0) {
      item.addons.forEach((addon: any) => {
        db.prepare('INSERT INTO order_item_addons (order_item_id, addon_id, addon_name, addon_price) VALUES (?, ?, ?, ?)')
          .run(orderItemId, addon.id, addon.name, addon.price);
      });
    }
  });

  logAction(null, 'create', 'order', orderId, JSON.stringify(req.body));
  res.status(201).json({ id: orderId, ...req.body, total });
});

router.put('/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(status, req.params.id);
  logAction(req.user?.userId || null, 'update_status', 'order', Number(req.params.id), status);
  res.json({ id: req.params.id, status });
});

export default router;
