import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import FeedbackForm from '@/components/feedback/feedback-form';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col items-center gap-8">
        <Button asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Link>
        </Button>

        <div className="max-w-md mx-auto w-full">
          <h2 className="text-xl font-semibold mb-4">Help Us Improve</h2>
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
}