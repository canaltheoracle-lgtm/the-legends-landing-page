import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('__dirname:', __dirname);
console.log('Caminho do banco:', path.join(__dirname, './database.db'));

const db = new Database(path.join(__dirname, './database.db'));

// Verificar se temos dados
const users = db.prepare('SELECT * FROM users').all();
console.log('Usuários:', users);

const categories = db.prepare('SELECT * FROM categories').all();
console.log('Categorias:', categories);

const products = db.prepare('SELECT * FROM products').all();
console.log('Produtos:', products);

db.close();
