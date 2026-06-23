import type { Product } from './product';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}
