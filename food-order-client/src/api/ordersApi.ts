import axiosInstance from './axiosInstance';
import type { Order, CreateOrderRequest } from '../types/order';

interface CreditCardInfo {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export const ordersApi = {
  placeOrder: async (request: CreateOrderRequest, cardInfo?: CreditCardInfo): Promise<Order> => {
    const payload = {
      ...request,
      cardNumber: cardInfo?.cardNumber,
      expiry: cardInfo?.expiry,
      cvv: cardInfo?.cvv,
    };
    const response = await axiosInstance.post<Order>('/orders', payload);
    return response.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>('/orders');
    return response.data;
  },

  getOrder: async (id: number): Promise<Order> => {
    const response = await axiosInstance.get<Order>(`/orders/${id}`);
    return response.data;
  },
};

export default ordersApi;
