import type { OrderStatus, PaymentMethod } from '../utils/constants';

export interface OrderItem {
  id: number;
  productId: number;
  productNameEn: string;
  productNameAr: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  phoneNumber: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  deliveryAddress: string;
  phoneNumber: string;
  notes?: string;
  paymentMethod: PaymentMethod;
}
