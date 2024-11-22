import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getShippingFee(subtotal: number) {
  return subtotal >= 500 ? 0 : 75;
}

export function formatPrice(amount: number) {
  return `₱${amount.toFixed(2)}`;
}