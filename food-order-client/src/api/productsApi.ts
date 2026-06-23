import axiosInstance from './axiosInstance';
import type { Product } from '../types/product';

export const productsApi = {
  getProducts: async (category?: string): Promise<Product[]> => {
    const params = category ? { category } : {};
    const response = await axiosInstance.get<Product[]>('/products', { params });
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
  },
};

export default productsApi;
