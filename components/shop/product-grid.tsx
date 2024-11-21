'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import ProductCard from './product-card';

interface ProductGridProps {
  products: Product[];
  searchTerm?: string;
  selectedCategories?: string[];
  selectedColors?: string[];
  sortBy?: string;
}

export default function ProductGrid({
  products,
  searchTerm = '',
  selectedCategories = [],
  selectedColors = [],
  sortBy = 'featured'
}: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category.toLowerCase())
      );
    }

    // Apply color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.color && selectedColors.includes(product.color.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      case 'best-selling':
        // Implement if you have sales data
        break;
      default:
        // 'featured' - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategories, selectedColors, sortBy]);

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