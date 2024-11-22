'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Tag, Palette, Package, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';

interface CategoryCount {
  id: string;
  label: string;
  count: number;
}

interface CategorySidebarProps {
  onSearch: (term: string) => void;
  onFilterChange: (selectedFilter: string | null) => void;
  isMobile: boolean;
}

export default function CategorySidebar({ onSearch, onFilterChange, isMobile }: CategorySidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [productTypes, setProductTypes] = useState<CategoryCount[]>([]);
  const [colors, setColors] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndProcessProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const products: Product[] = await response.json();

        // Process categories
        const categoryMap = new Map<string, number>();
        const productTypeMap = new Map<string, number>();
        const colorMap = new Map<string, number>();

        products.forEach(product => {
          // Process categories
          if (product.category) {
            const category = product.category.toLowerCase();
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
          }

          // Process product types
          if (product.productType) {
            const type = product.productType.toLowerCase();
            productTypeMap.set(type, (productTypeMap.get(type) || 0) + 1);
          }

          // Process colors
          if (product.color) {
            const color = product.color.toLowerCase();
            colorMap.set(color, (colorMap.get(color) || 0) + 1);
          }
        });

        // Convert maps to arrays and sort
        const processCategories = (map: Map<string, number>) => 
          Array.from(map.entries())
            .map(([id, count]) => ({
              id,
              label: id.charAt(0).toUpperCase() + id.slice(1),
              count
            }))
            .sort((a, b) => b.count - a.count);

        setCategories(processCategories(categoryMap));
        setProductTypes(processCategories(productTypeMap));
        setColors(processCategories(colorMap));
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndProcessProducts();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  const handleFilterChange = (value: string) => {
    const newFilter = value === "" ? null : value;
    setSelectedFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleReset = () => {
    setSelectedFilter(null);
    onFilterChange(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            disabled
          />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isMobile ? 'pb-20 mt-6' : ''}`}>
      <div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {selectedFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {categories.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </h3>
          <RadioGroup
            value={selectedFilter || ""}
            onValueChange={handleFilterChange}
            className="space-y-1.5"
          >
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.id} id={`category-${category.id}`} />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="flex-1 text-sm font-medium leading-none cursor-pointer"
                >
                  {category.label}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({category.count})
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {productTypes.length > 0 && (
        <>
          <Separator className="my-4" />
          <div>
            <h3 className="mb-3 text-lg font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              Product Types
            </h3>
            <RadioGroup
              value={selectedFilter || ""}
              onValueChange={handleFilterChange}
              className="space-y-1.5"
            >
              {productTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.id} id={`type-${type.id}`} />
                  <Label
                    htmlFor={`type-${type.id}`}
                    className="flex-1 text-sm font-medium leading-none cursor-pointer"
                  >
                    {type.label}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({type.count})
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </>
      )}

      {colors.length > 0 && (
        <>
          <Separator className="my-4" />
          <div>
            <h3 className="mb-3 text-lg font-semibold flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Colors
            </h3>
            <RadioGroup
              value={selectedFilter || ""}
              onValueChange={handleFilterChange}
              className="space-y-1.5"
            >
              {colors.map((color) => (
                <div key={color.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={color.id} id={`color-${color.id}`} />
                  <Label
                    htmlFor={`color-${color.id}`}
                    className="flex-1 text-sm font-medium leading-none cursor-pointer"
                  >
                    {color.label}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({color.count})
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </>
      )}
    </div>
  );
}