export interface Product {
  id: number;
  name: string;
  category: 'complement' | 'equipment' | 'clothing' | 'accessory';
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isPromo?: boolean;
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}