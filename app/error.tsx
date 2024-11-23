'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import FeedbackForm from '@/components/feedback/feedback-form';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
      <h1 className="mt-4 text-3xl font-bold">Something went wrong!</h1>
      <p className="mt-2 text-muted-foreground">
        We apologize for the inconvenience. Please try again or let us know about this issue.
      </p>
      
      <Button
        onClick={reset}
        className="mt-6 flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Try Again
      </Button>

      <div className="mt-12 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Report This Issue</h2>
        <FeedbackForm errorDetails={error.message} />
      </div>
    </div>
  );
}