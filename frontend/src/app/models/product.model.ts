export interface Product {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category_id?: string;
  category_name?: string;
  image_url: string;
  sizes: string;
  colors: string;
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  image_url: string;
  created_at?: string;
}

export interface CartItem {
  id?: string;
  _id?: string;
  product_id: string;
  name?: string;
  price?: number;
  image_url?: string;
  quantity: number;
  size: string;
  color: string;
  session_id?: string;
  stock?: number;
}

export interface Order {
  id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  status: string;
  items?: CartItem[];
  created_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  total?: string;
}
