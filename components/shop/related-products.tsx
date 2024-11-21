'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import ProductCard from './product-card';

interface RelatedProductsProps {
  currentProductId: string;
}

export default function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const products: Product[] = await response.json();
        const filtered = products
          .filter(product => product.id !== currentProductId)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        setRelatedProducts(filtered);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    }

    fetchProducts();
  }, [currentProductId]);

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {relatedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}