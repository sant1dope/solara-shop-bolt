'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { getCookie, setCookie } from 'cookies-next';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'solara-cart';

function saveCartData(items: CartItem[]) {
  // Save to both localStorage and cookies for redundancy
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }

  try {
    setCookie(CART_STORAGE_KEY, JSON.stringify(items), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
  } catch (error) {
    console.error('Error saving to cookies:', error);
  }
}

function loadCartData(): CartItem[] {
  try {
    // Try localStorage first
    const localData = localStorage.getItem(CART_STORAGE_KEY);
    if (localData) {
      const parsedData = JSON.parse(localData);
      if (Array.isArray(parsedData)) {
        return parsedData;
      }
    }

    // Fall back to cookies if localStorage fails
    const cookieData = getCookie(CART_STORAGE_KEY);
    if (cookieData) {
      const parsedData = JSON.parse(cookieData as string);
      if (Array.isArray(parsedData)) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error('Error loading cart data:', error);
  }

  return [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Load cart data on mount
  useEffect(() => {
    const savedItems = loadCartData();
    setItems(savedItems);
    setIsInitialized(true);
  }, []);

  // Save cart data whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveCartData(items);
    }
  }, [items, isInitialized]);

  const addItem = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        toast({
          title: 'Already in bag',
          description: 'This item is already in your bag',
        });
        return currentItems;
      }

      toast({
        title: 'Added to bag',
        description: `${product.name} has been added to your bag`,
      });

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) => 
      currentItems.filter((item) => item.id !== productId)
    );
    toast({
      title: 'Removed from bag',
      description: 'Item has been removed from your bag',
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    saveCartData([]); // Explicitly clear stored data
    toast({
      title: 'Bag cleared',
      description: 'All items have been removed from your bag',
    });
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
      }}
    >
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