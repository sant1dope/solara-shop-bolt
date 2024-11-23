'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer/footer';
import { CartProvider } from '@/components/providers/cart-provider';
import { usePathname } from 'next/navigation';

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <CartProvider>
        <div className="min-h-screen bg-background">
          {!isAuthPage && <Header />}
          <main>{children}</main>
          {!isAuthPage && <Footer />}
          <Toaster />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}