import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Addon {
  id: number;
  name: string;
  price: number;
  groupId: number;
  available: boolean;
  sortOrder: number;
  createdAt?: string;
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

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  observation?: string;
  addons: Addon[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, addons?: Addon[], observation?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, addons: Addon[] = [], observation?: string) => {
    const newItem: CartItem = {
      id: generateId(),
      product,
      quantity: 1,
      observation,
      addons
    };
    setCart(prev => [...prev, newItem]);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const calculateItemTotal = (item: CartItem) => {
    let total = item.product.price * item.quantity;
    total += item.addons.reduce((sum, addon) => sum + addon.price * item.quantity, 0);
    return total;
  };

  const total = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
