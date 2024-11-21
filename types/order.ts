export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderData {
  customerName: string;
  email: string;
  address: string;
  contactNumber: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  updatePreference: 'messenger' | 'email' | 'viber';
}