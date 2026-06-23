import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';
import { useAuth } from './AuthContext';
import cartApi from '../api/cartApi';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart from backend (if logged in) or localStorage (if guest)
  const syncCart = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const backendItems = await cartApi.getCart();
        setItems(backendItems);
      } catch (err) {
        console.error('Failed to sync cart with backend:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const saved = localStorage.getItem('cart');
        setItems(saved ? JSON.parse(saved) : []);
      } catch {
        setItems([]);
      }
    }
  }, [isAuthenticated]);

  // Sync on auth state change
  useEffect(() => {
    syncCart();
  }, [syncCart]);

  const addItem = useCallback(async (product: Product, quantity: number = 1) => {
    if (isAuthenticated) {
      try {
        const updatedItem = await cartApi.addToCart(product.id, quantity);
        setItems((prev) => {
          const filtered = prev.filter((item) => item.productId !== product.id);
          return [...filtered, updatedItem];
        });
      } catch (err) {
        console.error('Failed to add cart item to backend:', err);
      }
    } else {
      setItems((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        let updated: CartItem[];

        if (existing) {
          updated = prev.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem: CartItem = {
            id: Date.now(),
            productId: product.id,
            quantity,
            product,
          };
          updated = [...prev, newItem];
        }

        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      });
    }
  }, [isAuthenticated]);

  const removeItem = useCallback(async (productId: number) => {
    const itemToRemove = items.find((item) => item.productId === productId);
    if (!itemToRemove) return;

    if (isAuthenticated) {
      try {
        await cartApi.removeFromCart(itemToRemove.id);
        setItems((prev) => prev.filter((item) => item.productId !== productId));
      } catch (err) {
        console.error('Failed to remove cart item from backend:', err);
      }
    } else {
      setItems((prev) => {
        const updated = prev.filter((item) => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      });
    }
  }, [isAuthenticated, items]);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    const itemToUpdate = items.find((item) => item.productId === productId);
    if (!itemToUpdate) return;

    if (isAuthenticated) {
      try {
        await cartApi.updateQuantity(itemToUpdate.id, quantity);
        setItems((prev) =>
          prev.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )
        );
      } catch (err) {
        console.error('Failed to update cart item quantity on backend:', err);
      }
    } else {
      setItems((prev) => {
        const updated = prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      });
    }
  }, [isAuthenticated, items, removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cart');
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
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
        syncCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
