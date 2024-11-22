'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import RelatedProducts from '@/components/shop/related-products';
import { useCart } from '@/components/providers/cart-provider';
import { Product } from '@/types/product';
import { useState } from 'react';

const BADGE_VARIANTS: Record<string, {
  variant: "default" | "destructive" | "outline" | "secondary",
  className: string
}> = {
  'sold-out': {
    variant: "destructive",
    className: "bg-red-500"
  },
  'most-loved': {
    variant: "secondary",
    className: "bg-pink-500 text-white"
  },
  'new-arrival': {
    variant: "secondary",
    className: "bg-emerald-500 text-white"
  },
  'sale': {
    variant: "secondary",
    className: "bg-amber-500 text-white"
  },
  'bundle': {
    variant: "secondary",
    className: "bg-purple-500 text-white"
  }
};

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Create an array of images, using the main image if no additional images
  const images = product.images?.length 
    ? [product.image, ...product.images] 
    : [product.image];

  // Find sale badge if it exists
  const saleBadge = product.badges?.find(badge => badge.type === 'sale');
  const discount = saleBadge?.discount || 0;

  // Calculate discounted price if there's a discount
  const originalPrice = product.price;
  const discountedPrice = discount > 0 
    ? originalPrice * (1 - discount / 100)
    : originalPrice;

  // Split images into rows of 7
  const chunkedImages = images.reduce((resultArray: string[][], item, index) => { 
    const chunkIndex = Math.floor(index / 7);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex items-center text-sm text-muted-foreground">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={images[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover transition-transform hover:scale-105"
              priority
            />
            {product.badges && product.badges.length > 0 && (
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {product.badges.map((badge) => {
                  const badgeStyle = BADGE_VARIANTS[badge.type] || BADGE_VARIANTS['new-arrival'];
                  return (
                    <Badge
                      key={badge.type}
                      variant={badgeStyle.variant}
                      className={badgeStyle.className}
                    >
                      {badge.label}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="space-y-2">
              {chunkedImages.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 justify-start">
                  {row.map((image, index) => {
                    const absoluteIndex = rowIndex * 7 + index;
                    return (
                      <button
                        key={absoluteIndex}
                        onClick={() => setCurrentImageIndex(absoluteIndex)}
                        className={`relative aspect-square w-[calc((100%-48px)/7)] flex-none overflow-hidden rounded-md ${
                          currentImageIndex === absoluteIndex 
                            ? 'ring-2 ring-primary' 
                            : 'ring-1 ring-gray-200'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${absoluteIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-sm text-muted-foreground">{product.productType}</p>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {Array.from({ length: product.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-primary text-primary"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating} stars)
              </span>
            </div>
          </div>

          <div className="space-y-1">
            {discount > 0 ? (
              <>
                <div className="text-2xl font-bold text-primary">
                  ₱{discountedPrice.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground line-through">
                  ₱{originalPrice.toFixed(2)}
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold">
                ₱{originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <p>{product.description || 'No description available.'}</p>
          </div>

          <Button
            onClick={() => addItem({
              ...product,
              price: discountedPrice
            })}
            size="lg"
            className="w-full"
            disabled={product.soldOut}
          >
            {product.soldOut ? 'Sold Out' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-8 text-2xl font-bold">You might also like</h2>
        <RelatedProducts currentProductId={product.id} />
      </div>
    </div>
  );
}