import axiosInstance from './axiosInstance';
import type { CartItem } from '../types/cart';

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await axiosInstance.get<CartItem[]>('/cart');
    return response.data;
  },

  addToCart: async (productId: number, quantity: number = 1): Promise<CartItem> => {
    const response = await axiosInstance.post<CartItem>('/cart', { productId, quantity });
    return response.data;
  },

  updateQuantity: async (id: number, quantity: number): Promise<void> => {
    await axiosInstance.put(`/cart/${id}`, { quantity });
  },

  removeFromCart: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/cart/${id}`);
  },
};

export default cartApi;
