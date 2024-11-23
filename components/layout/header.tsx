'use client';

import Link from 'next/link';
import { Menu, SunIcon, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/providers/cart-provider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-900 bg-accent-cream/95 backdrop-blur supports-[backdrop-filter]:bg-accent-cream/60">
      <div className="container mx-auto max-w-[1300px] flex h-16 items-center px-4 pl-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link
                href="https://solara-official.vercel.app/"
                className="font-display2 text-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="font-display2 text-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Shop
              </Link>
              {isSignedIn && (
                <Link
                  href="/profile"
                  className="font-display2 text-lg font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between md:justify-start md:space-x-10">
          <Link 
            href="/" 
            className="flex items-center space-x-2"
          >
            <span className="font-display text-[#9c6644] text-2xl font-semibold text-primary-dark flex items-center">
              <SunIcon className="h-9 w-9" />
              &nbsp;SOLARA
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 flex-auto justify-center">
            <Link
              href="https://solara-official.vercel.app/"
              className="font-accent text-base font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="font-accent text-base font-medium transition-colors hover:text-primary"
            >
              Shop
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>

            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => router.push('/sign-in')}>
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}