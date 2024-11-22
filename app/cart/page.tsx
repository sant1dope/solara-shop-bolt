'use client';

import { useCart } from '@/components/providers/cart-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, MinusCircle, PlusCircle, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getShippingFee, formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const router = useRouter();

  const shippingFee = getShippingFee(total);
  const finalTotal = total + shippingFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center mt-12">
        <h1 className="mb-8 text-3xl font-bold">Your Bag is Empty</h1>
        <p className="mb-8 text-muted-foreground">
          Looks like you haven't added any items to your bag yet.
        </p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-2">
      <div className="flex items-center mb-8">
        <ShoppingBag className="h-9 w-9 mr-2" />
        <h1 className="text-3xl font-bold">Shopping Bag</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="mb-4 rounded-lg border p-4"
            >
              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <Input
                    type="text"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value) || 1)
                    }
                    className="w-16 text-center"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-right font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Layout */}
              <div className="sm:hidden">
                <div className="flex space-x-3">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -ml-2"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between py-1">
                    <div className="font-semibold text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <Input
                        type="text"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-12 h-8 text-center px-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border p-6 mb-4 sticky top-4">
          <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping</span>
              <div className="text-right">
                <span className={shippingFee === 0 ? "text-emerald-600 font-medium" : ""}>
                  {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}
                </span>
                {total < 500 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Add {formatPrice(500 - total)} more for free shipping
                  </p>
                )}
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}