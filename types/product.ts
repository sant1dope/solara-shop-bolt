export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[]; // Add support for multiple images
  category: string;
  rating: number;
  description?: string;
  soldOut?: boolean;
  color?: string;
  stock?: number;
  createdAt?: number;
  updatedAt?: number;
}