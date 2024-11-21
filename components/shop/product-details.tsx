'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Star, ChevronLeft, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RelatedProducts from '@/components/shop/related-products';
import { useCart } from '@/components/providers/cart-provider';
import { Product } from '@/types/product';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer">
                <Image
                  src={images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  priority
                />
                {product.soldOut && (
                  <Badge
                    variant="destructive"
                    className="absolute right-2 top-2"
                  >
                    Sold Out
                  </Badge>
                )}
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <div className="relative py-6">
                <Carousel className="w-full">
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-square">
                          <Image
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="absolute top-1/2 -left-12 transform -translate-y-1/2">
                    <CarouselPrevious className="relative" />
                  </div>
                  <div className="absolute top-1/2 -right-12 transform -translate-y-1/2">
                    <CarouselNext className="relative" />
                  </div>
                </Carousel>
              </div>
            </DialogContent>
          </Dialog>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-md ${
                    currentImageIndex === index 
                      ? 'ring-2 ring-primary' 
                      : 'ring-1 ring-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-4 flex items-center space-x-2">
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

          <div className="text-2xl font-bold">
            ${product.price.toFixed(2)}
          </div>

          <div className="prose max-w-none">
            <p>{product.description || 'No description available.'}</p>
          </div>

          <Button
            onClick={() => addItem(product)}
            size="lg"
            className="w-full"
            disabled={product.soldOut}
          >
            {product.soldOut ? 'Sold Out' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-8 text-2xl font-bold">Related Products</h2>
        <RelatedProducts currentProductId={product.id} />
      </div>
    </div>
  );
}