export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'attendant' | 'kitchen' | 'delivery';
}

export interface Category {
  id: number;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number | null;
  available: number;
  image_url: string | null;
  allergens: string | null;
  category_name: string | null;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  total: number;
  payment_method: string | null;
  status: 'received' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface Stats {
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
}
