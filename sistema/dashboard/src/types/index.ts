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

export interface OrderItemAddon {
  id: number;
  order_item_id: number;
  addon_id: number;
  addon_name: string;
  addon_price: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  observation?: string;
  addons?: OrderItemAddon[];
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

export interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  product_name: string;
  quantity: number;
  revenue: number;
}

export interface PaymentMethodStat {
  method: string;
  count: number;
  total: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface HourlyDistribution {
  hour: number;
  count: number;
}

export interface AdvancedStats {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  cancelledOrders: number;
  dailyRevenue: DailyRevenue[];
  topProducts: TopProduct[];
  paymentMethods: PaymentMethodStat[];
  statusDistribution: StatusDistribution[];
  hourlyDistribution: HourlyDistribution[];
}
