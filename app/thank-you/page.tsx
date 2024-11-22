import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
      <h1 className="mt-6 text-3xl font-bold">Thank You for Your Order!</h1>
      <p className="mt-4 text-muted-foreground">
        We've received your order and will send you updates via your preferred
        communication method. Order generally arrives in 3 to 8 business days.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}