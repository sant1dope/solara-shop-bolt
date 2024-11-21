'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Tag, Palette } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';

interface CategoryCount {
  id: string;
  label: string;
  count: number;
}

interface ColorCount {
  id: string;
  label: string;
  count: number;
}

interface CategorySidebarProps {
  onSearch: (term: string) => void;
  onFilterChange: (categories: string[], colors: string[]) => void;
}

export default function CategorySidebar({ onSearch, onFilterChange }: CategorySidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [colors, setColors] = useState<ColorCount[]>([]);
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
        products.forEach(product => {
          if (product.category) {
            const category = product.category.toLowerCase();
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
          }
        });

        const processedCategories = Array.from(categoryMap.entries())
          .map(([id, count]) => ({
            id,
            label: id.charAt(0).toUpperCase() + id.slice(1),
            count
          }))
          .sort((a, b) => b.count - a.count);

        // Process colors
        const colorMap = new Map<string, number>();
        products.forEach(product => {
          if (product.color) {
            const color = product.color.toLowerCase();
            colorMap.set(color, (colorMap.get(color) || 0) + 1);
          }
        });

        const processedColors = Array.from(colorMap.entries())
          .map(([id, count]) => ({
            id,
            label: id.charAt(0).toUpperCase() + id.slice(1),
            count
          }))
          .sort((a, b) => b.count - a.count);

        setCategories(processedCategories);
        setColors(processedColors);
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

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);
    setSelectedCategories(newCategories);
    onFilterChange(newCategories, selectedColors);
  };

  const handleColorChange = (colorId: string, checked: boolean) => {
    const newColors = checked
      ? [...selectedColors, colorId]
      : selectedColors.filter((id) => id !== colorId);
    setSelectedColors(newColors);
    onFilterChange(selectedCategories, newColors);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-4 w-4" />
              <Skeleton className="h-6 w-24" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-2 mb-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-4 w-4" />
              <Skeleton className="h-6 w-16" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2 mb-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {categories.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Categories
              </h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={category.id}
                      className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.label}
                    </label>
                    <span className="text-sm text-muted-foreground">
                      ({category.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Colors
                </h3>
                <div className="space-y-3">
                  {colors.map((color) => (
                    <div key={color.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color.id}`}
                        checked={selectedColors.includes(color.id)}
                        onCheckedChange={(checked) => 
                          handleColorChange(color.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`color-${color.id}`}
                        className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {color.label}
                      </label>
                      <span className="text-sm text-muted-foreground">
                        ({color.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}