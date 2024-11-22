'use client';

import { Suspense, useState, useEffect } from 'react';
import CategorySidebar from '@/components/shop/category-sidebar';
import ProductGrid from '@/components/shop/product-grid';
import { ProductSort } from '@/components/shop/product-sort';
import { Separator } from '@/components/ui/separator';
import { Loading } from '@/components/ui/loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { Store, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false); // Close sheet when search is submitted
  };

  const handleFilterChange = (filter: string | null) => {
    setSelectedFilter(filter);
    setIsOpen(false); // Close sheet after filter selection
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
        {/* Mobile Filter Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <div className="md:hidden flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Store className="h-6 w-6 mr-2" />
              <h1 className="text-2xl font-bold">Solara Shop</h1>
            </div>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <ScrollArea className="h-full px-4 py-6">
              <CategorySidebar
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                isMobile={true}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <CategorySidebar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            isMobile={false}
          />
        </aside>

        <div className="flex-1">
          <div className="hidden md:flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Store className="h-9 w-9 mr-2" />
              <h1 className="text-3xl font-bold">Solara Shop</h1>
            </div>
            <ProductSort value={sortBy} onValueChange={handleSortChange} />
          </div>

          {/* Mobile Sort */}
          <div className="md:hidden mb-4">
            <ProductSort value={sortBy} onValueChange={handleSortChange} />
          </div>

          <Separator className="mb-6" />
          <ProductGrid
            products={products}
            searchTerm={searchTerm}
            selectedFilter={selectedFilter}
            sortBy={sortBy}
          />
        </div>
      </div>
    </div>
  );
}