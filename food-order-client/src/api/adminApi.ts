import axiosInstance from './axiosInstance';
import type { Order } from '../types/order';
import type { Product } from '../types/product';

export const adminApi = {
  getAllOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>('/admin/orders');
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string): Promise<void> => {
    await axiosInstance.put(`/admin/orders/${id}/status`, { status });
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await axiosInstance.post<Product>('/admin/products', product);
    return response.data;
  },

  updateProduct: async (id: number, product: Omit<Product, 'id'>): Promise<void> => {
    await axiosInstance.put(`/admin/products/${id}`, product);
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/products/${id}`);
  },
};

export default adminApi;
