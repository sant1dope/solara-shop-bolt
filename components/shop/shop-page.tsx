'use client';

import { Suspense, useState, useEffect } from 'react';
import CategorySidebar from '@/components/shop/category-sidebar';
import ProductGrid from '@/components/shop/product-grid';
import { ProductSort } from '@/components/shop/product-sort';
import { Separator } from '@/components/ui/separator';
import { Loading } from '@/components/ui/loading';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid products data received');
        }
        setProducts(data);
        setError(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load products';
        setError(message);
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [toast]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (categories: string[], colors: string[]) => {
    setSelectedCategories(categories);
    setSelectedColors(colors);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <CategorySidebar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
        </aside>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Shop</h1>
            <ProductSort value={sortBy} onValueChange={handleSortChange} />
          </div>
          <Separator className="mb-6" />
          <ProductGrid
            products={products}
            searchTerm={searchTerm}
            selectedCategories={selectedCategories}
            selectedColors={selectedColors}
            sortBy={sortBy}
          />
        </div>
      </div>
    </div>
  );
}