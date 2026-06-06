interface Addon {
  id: number;
  name: string;
  price: number;
  groupId: number;
  available: boolean;
  sortOrder: number;
  createdAt?: string;
}

interface AddonGroup {
  id: number;
  name: string;
  productId: number;
  minOptions: number;
  maxOptions: number;
  sortOrder: number;
  createdAt?: string;
  addons: Addon[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  available: boolean;
  imageUrl?: string;
  allergens?: string;
  variations?: string;
  createdAt?: string;
  updatedAt?: string;
  addonGroups?: AddonGroup[];
}

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  observation?: string;
  addons?: Addon[];
}

interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  paymentMethod: string;
  paymentLocation?: string;
  needsChange?: boolean;
  changeFor?: string;
  notes?: string;
  items: OrderItem[];
}

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  paymentMethod: string;
  status: string;
  total: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  items: OrderItem[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },
};
