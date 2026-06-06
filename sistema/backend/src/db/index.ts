import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = process.env.DB_PATH || path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'database.db');
console.log('Caminho do banco de dados:', dbPath);

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const createTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'attendant',
      twofa_secret TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category_id INTEGER,
      available INTEGER DEFAULT 1,
      image_url TEXT,
      allergens TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS addon_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      product_id INTEGER,
      min_options INTEGER DEFAULT 0,
      max_options INTEGER DEFAULT 999,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS addons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL DEFAULT 0,
      group_id INTEGER NOT NULL,
      available INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES addon_groups(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT,
      total REAL NOT NULL,
      payment_method TEXT,
      status TEXT NOT NULL DEFAULT 'received',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      price REAL NOT NULL,
      observation TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS order_item_addons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_item_id INTEGER NOT NULL,
      addon_id INTEGER NOT NULL,
      addon_name TEXT NOT NULL,
      addon_price REAL NOT NULL,
      FOREIGN KEY (order_item_id) REFERENCES order_items(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id INTEGER,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  const adminExists = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin') as { count: number };
  if (adminExists.count === 0) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    ).run('Administrador', 'admin@thelegends.com', hashedPassword, 'admin');
  }

  // NOTA: Dados de exemplo só são inseridos se o banco estiver COMPLETAMENTE vazio
  // Isso garante que dados existentes NÃO sejam sobrescritos
  const categoryExists = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  const productExists = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (categoryExists.count === 0 && productExists.count === 0) {
    console.log('Inserindo dados de exemplo (banco de dados vazio)...');
    db.prepare('INSERT INTO categories (name, sort_order) VALUES (?, ?)').run('Hambúrgueres', 1);
    db.prepare('INSERT INTO categories (name, sort_order) VALUES (?, ?)').run('Acompanhamentos', 2);
    db.prepare('INSERT INTO categories (name, sort_order) VALUES (?, ?)').run('Bebidas', 3);

    const cat1 = db.prepare('SELECT id FROM categories WHERE name = ?').get('Hambúrgueres') as { id: number };
    const cat2 = db.prepare('SELECT id FROM categories WHERE name = ?').get('Acompanhamentos') as { id: number };
    const cat3 = db.prepare('SELECT id FROM categories WHERE name = ?').get('Bebidas') as { id: number };

    const marioBurgerId = db.prepare('INSERT INTO products (name, description, price, category_id, available) VALUES (?, ?, ?, ?, ?)')
      .run('Super Mario Burger', '2 carnes smash, cogumelos salteados, queijo cheddar e molho especial', 32.00, cat1.id, 1).lastInsertRowid as number;
    const fatalityId = db.prepare('INSERT INTO products (name, description, price, category_id, available) VALUES (?, ?, ?, ?, ?)')
      .run('Fatality Cheese', 'Pão brioche, 3 carnes 180g, muito bacon crocante e maionese verde', 45.00, cat1.id, 1).lastInsertRowid as number;
    const linksId = db.prepare('INSERT INTO products (name, description, price, category_id, available) VALUES (?, ?, ?, ?, ?)')
      .run('Link\'s Adventure', 'Frango crocante, alface, tomate, cebola roxa e molho de ervas', 28.00, cat1.id, 1).lastInsertRowid as number;
    const sonicId = db.prepare('INSERT INTO products (name, description, price, category_id, available) VALUES (?, ?, ?, ?, ?)')
      .run('Sonic Speed', 'Carne bovina, anéis de cebola, barbecue e queijo prato', 35.00, cat1.id, 1).lastInsertRowid as number;
    
    db.prepare('INSERT INTO products (name, description, price, category_id, available) VALUES (?, ?, ?, ?, ?)')
      .run('Batata Rústica', 'Batatas fritas crocantes com ervas finas', 15.00, cat2.id, 1);
    db.prepare('INSERT INTO products (name, description, price, category_id, available) VALUES (?, ?, ?, ?, ?)')
      .run('Onion Rings', 'Anéis de cebola empanados crocantes', 12.00, cat2.id, 1);
    
    db.prepare('INSERT INTO products (name, description, price, category_id, available) VALUES (?, ?, ?, ?, ?)')
      .run('Refrigerante', 'Coca-Cola, Fanta ou Guaraná', 8.00, cat3.id, 1);
    db.prepare('INSERT INTO products (name, description, price, category_id, available) VALUES (?, ?, ?, ?, ?)')
      .run('Milkshake', 'Milkshake de chocolate, morango ou baunilha', 18.00, cat3.id, 1);

    // Adicionar grupos de adicionais para hambúrgueres
    const productsWithAddons = [marioBurgerId, fatalityId, linksId, sonicId];
    productsWithAddons.forEach(productId => {
      // Grupo: Vamos dar um UPGRADE no seu Burger?
      const upgradeGroupId = db.prepare('INSERT INTO addon_groups (name, product_id, min_options, max_options, sort_order) VALUES (?, ?, ?, ?, ?)')
        .run('Vamos dar um UPGRADE no seu Burger?', productId, 0, 15, 1).lastInsertRowid as number;
      
      // Adicionais do grupo upgrade
      const upgrades = [
        { name: 'Alface', price: 1.00 },
        { name: 'Bacon', price: 5.50 },
        { name: 'Catupiry', price: 5.90 },
        { name: 'Catupiry Empanado 130g', price: 14.90 },
        { name: 'Cebola Caramelizada', price: 4.90 },
        { name: 'Cebola Roxa', price: 1.00 },
        { name: 'Cheddar Empanado 130g', price: 14.90 },
        { name: 'Cream Cheese', price: 4.90 },
        { name: 'Geleia de Pimenta', price: 4.90 },
        { name: 'Hamburger + Queijo Cheddar', price: 11.90 },
        { name: 'Queijo Cheddar Fatia', price: 2.90 },
        { name: 'Cheddar Cremoso', price: 4.90 },
        { name: 'Adicional de Queijo Fatia', price: 2.90 },
        { name: 'Queijo Prato Fatia', price: 2.90 },
        { name: 'Tomate', price: 1.00 },
        { name: 'Farofa de Bacon', price: 5.90 },
        { name: 'Ovo Frito', price: 2.90 },
        { name: 'Hamburger + Queijo Prato', price: 11.90 },
      ];
      upgrades.forEach((addon, index) => {
        db.prepare('INSERT INTO addons (name, price, group_id, sort_order) VALUES (?, ?, ?, ?)')
          .run(addon.name, addon.price, upgradeGroupId, index);
      });

      // Grupo: Escolha seu Molho
      const sauceGroupId = db.prepare('INSERT INTO addon_groups (name, product_id, min_options, max_options, sort_order) VALUES (?, ?, ?, ?, ?)')
        .run('Escolha seu Molho', productId, 1, 1, 2).lastInsertRowid as number;
      
      // Adicionais do grupo molho
      const sauces = [
        { name: 'Maionese Folhas Verdes', price: 0 },
        { name: 'Maionese Honey Mustard', price: 0 },
        { name: 'Molho Barbecue', price: 0 },
        { name: 'Molho de Katchup', price: 0 },
        { name: 'Não Quero Maionese', price: 0 },
      ];
      sauces.forEach((addon, index) => {
        db.prepare('INSERT INTO addons (name, price, group_id, sort_order) VALUES (?, ?, ?, ?)')
          .run(addon.name, addon.price, sauceGroupId, index);
      });

      // Grupo: Que tal uma bebida?
      const drinkGroupId = db.prepare('INSERT INTO addon_groups (name, product_id, min_options, max_options, sort_order) VALUES (?, ?, ?, ?, ?)')
        .run('Que tal uma bebida?', productId, 0, 999, 3).lastInsertRowid as number;
      
      // Adicionais do grupo bebida
      const drinks = [
        { name: 'Água com gás', price: 2.99 },
        { name: 'Água sem gás', price: 2.99 },
        { name: 'Coca-Cola 350ml', price: 5.99 },
        { name: 'Coca-Cola Zero 350ml', price: 5.99 },
        { name: 'Guaraná 220ml', price: 3.99 },
        { name: 'Coca-Cola 200ml', price: 3.50 },
        { name: 'Coca-Cola Zero 200ml', price: 3.50 },
        { name: 'Coca-Cola Lata 220ml', price: 3.99 },
        { name: 'Coca-Cola Lata Zero 220ML', price: 3.99 },
        { name: 'Guaraná Antarctica 200ml', price: 3.50 },
        { name: 'Adicional de Suco', price: 2.00 },
      ];
      drinks.forEach((addon, index) => {
        db.prepare('INSERT INTO addons (name, price, group_id, sort_order) VALUES (?, ?, ?, ?)')
          .run(addon.name, addon.price, drinkGroupId, index);
      });
    });
  } else {
    console.log('Banco de dados já contém dados - pulando inserção de exemplos.');
  }
};

createTables();

export default db;
