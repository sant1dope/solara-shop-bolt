'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import ProductCard from './product-card';

interface ProductGridProps {
  products: Product[];
  searchTerm?: string;
  selectedFilter: string | null;
  sortBy?: string;
}

export default function ProductGrid({
  products,
  searchTerm = '',
  selectedFilter = null,
  sortBy = 'featured'
}: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    let filtered = [...products];

    // Only show active products
    filtered = filtered.filter(product => product.isActive);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply single filter (category, product type, or color)
    if (selectedFilter) {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === selectedFilter ||
        product.productType?.toLowerCase() === selectedFilter ||
        product.color?.toLowerCase() === selectedFilter
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      case 'best-selling':
        filtered = filtered.filter(product => 
          product.badges?.some(badge => badge.type === 'most-loved')
        ).concat(filtered.filter(product => 
          !product.badges?.some(badge => badge.type === 'most-loved')
        ));
        break;
      default:
        // 'featured' - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedFilter, sortBy]);

  if (!Array.isArray(products)) {
    return (
      <div className="col-span-full text-center py-8">
        <p className="text-muted-foreground">Error loading products</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  );
}