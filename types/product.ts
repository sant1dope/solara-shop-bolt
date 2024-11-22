export type BadgeType = 'sold-out' | 'most-loved' | 'new-arrival' | 'sale' | 'bundle' | string;

export interface ProductBadge {
  type: BadgeType;
  label: string;
  discount?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  image: string;
  images?: string[];
  category: string;
  productType: string;
  isActive: boolean;
  rating: number;
  description?: string;
  badges?: ProductBadge[];
  color?: string;
  stock?: number;
  soldOut?: boolean;
  createdAt?: number;
  updatedAt?: number;
}