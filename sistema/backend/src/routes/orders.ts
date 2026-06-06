import express from 'express';
import db from '../db';
import { authenticateToken, requireRole } from '../middleware/auth';
import { logAction } from '../utils/audit';

const router = express.Router();

const fixDate = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;
  return dateStr.endsWith('Z') ? dateStr : dateStr + 'Z';
};

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
    return { ...order, created_at: fixDate(order.created_at), updated_at: fixDate(order.updated_at), items };
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

router.get('/stats/advanced', authenticateToken, (req, res) => {
  const { startDate, endDate } = req.query;
  let dateFilter = '';
  const params: any[] = [];
  if (startDate) {
    dateFilter += ' AND o.created_at >= ?';
    params.push(startDate);
  }
  if (endDate) {
    dateFilter += ' AND o.created_at <= ?';
    params.push(endDate);
  }

  const summary = db.prepare(`
    SELECT 
      COALESCE(SUM(o.total), 0) as totalRevenue,
      COUNT(*) as totalOrders,
      COALESCE(SUM(o.total) / CAST(COUNT(*) AS REAL), 0) as averageTicket,
      SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) as cancelledOrders
    FROM orders o WHERE 1=1${dateFilter}
  `).get(...params) as any;

  const dailyRevenue = db.prepare(`
    SELECT DATE(o.created_at) as date, SUM(o.total) as revenue, COUNT(*) as orders
    FROM orders o WHERE o.status != 'cancelled'${dateFilter}
    GROUP BY DATE(o.created_at) ORDER BY date
  `).all(...params);

  const topProducts = db.prepare(`
    SELECT p.name as product_name, SUM(oi.quantity) as quantity, SUM(oi.price * oi.quantity) as revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status != 'cancelled'${dateFilter}
    GROUP BY p.id ORDER BY quantity DESC LIMIT 10
  `).all(...params);

  const paymentMethods = db.prepare(`
    SELECT o.payment_method as method, COUNT(*) as count, COALESCE(SUM(o.total), 0) as total
    FROM orders o WHERE 1=1${dateFilter}
    GROUP BY o.payment_method ORDER BY count DESC
  `).all(...params);

  const statusDistribution = db.prepare(`
    SELECT o.status, COUNT(*) as count
    FROM orders o WHERE 1=1${dateFilter}
    GROUP BY o.status ORDER BY count DESC
  `).all(...params);

  const hourlyDistribution = db.prepare(`
    SELECT CAST(STRFTIME('%H', o.created_at) AS INTEGER) as hour, COUNT(*) as count
    FROM orders o WHERE 1=1${dateFilter}
    GROUP BY hour ORDER BY hour
  `).all(...params);

  res.json({
    totalRevenue: summary.totalRevenue,
    totalOrders: summary.totalOrders,
    averageTicket: summary.averageTicket,
    cancelledOrders: summary.cancelledOrders,
    dailyRevenue,
    topProducts,
    paymentMethods,
    statusDistribution,
    hourlyDistribution,
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

  res.json({ ...order, created_at: fixDate(order.created_at), updated_at: fixDate(order.updated_at), items });
});

router.post('/', (req, res) => {
  const { 
    customer_name, customer_phone, customer_address, payment_method, notes, items,
    customerName, customerPhone, customerAddress, paymentMethod,
    paymentLocation, needsChange, changeFor
  } = req.body;
  
  const finalCustomerName = customerName || customer_name;
  const finalCustomerPhone = customerPhone || customer_phone;
  const finalCustomerAddress = customerAddress || customer_address;
  const finalPaymentMethod = paymentMethod || payment_method;
  
  let finalNotes = notes || '';
  if (needsChange) {
    finalNotes += `${finalNotes ? ' | ' : ''}Troco para R$ ${changeFor}`;
  }
  
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
  `).run(finalCustomerName, finalCustomerPhone, finalCustomerAddress, total, finalPaymentMethod, finalNotes);

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
