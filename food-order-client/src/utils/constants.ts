export const API_BASE_URL = '/api';

export const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Drinks', 'Desserts'] as const;

export type Category = (typeof CATEGORIES)[number];

export const ORDER_STATUSES = ['Pending', 'Preparing', 'OutForDelivery', 'Delivered'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ['COD', 'Online'] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
