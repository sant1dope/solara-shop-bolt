'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/providers/cart-provider';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

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

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  // Find sale badge if it exists
  const saleBadge = product.badges?.find(badge => badge.type === 'sale');
  const discount = saleBadge?.discount || 0;

  // Calculate discounted price if there's a discount
  const originalPrice = product.price;
  const discountedPrice = discount > 0 
    ? originalPrice * (1 - discount / 100)
    : originalPrice;

  return (
    <Card className="overflow-hidden">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
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
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold hover:underline">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 font-light">
          {product.productType}
        </p>
        <div className="mt-2">
          {discount > 0 ? (
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-primary">
                ₱{discountedPrice.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground line-through">
                ₱{originalPrice.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-lg font-bold">
              ₱{originalPrice.toFixed(2)}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={product.soldOut}
          onClick={() => addItem({
            ...product,
            price: discountedPrice // Use discounted price when adding to cart
          })}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Bag
        </Button>
      </CardFooter>
    </Card>
  );
}