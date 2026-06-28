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
    let apiOrders: Order[] = [];
    try {
      const response = await axiosInstance.get<Order[]>('/orders');
      apiOrders = response.data;
    } catch (err) {
      console.warn('Failed to fetch orders from API, returning local mock orders', err);
    }
    const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    return [...localOrders, ...apiOrders];
  },

  getOrder: async (id: number): Promise<Order> => {
    try {
      const response = await axiosInstance.get<Order>(`/orders/${id}`);
      return response.data;
    } catch (err) {
      const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
      const localOrder = localOrders.find((o: any) => o.id === id);
      if (localOrder) {
        return localOrder;
      }
      throw err;
    }
  },
};

export default ordersApi;
