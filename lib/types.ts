export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  promotional_price: number | null;
  weight_kg: number;
  height_cm: number;
  width_cm: number;
  depth_cm: number;
  stock: number;
  sku: string | null;
  barcode: string | null;
  is_active: boolean;
  image_url: string | null;
  categories: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  shipping_cost: number;
  shipping_method: string;
  subtotal: number;
  total: number;
  status: OrderStatus;
  mercadopago_preference_id: string | null;
  mercadopago_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ShippingAddress {
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  city: string;
  province: string;
  postal_code: string;
}

export type OrderStatus = 
  | "pending" 
  | "approved" 
  | "in_process" 
  | "rejected" 
  | "cancelled" 
  | "shipped" 
  | "delivered";

export interface ShippingQuote {
  service_type: string;
  service_name: string;
  price: number;
  delivery_time: string;
}
