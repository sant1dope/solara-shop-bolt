'use client';

import FeedbackForm from '@/components/feedback/feedback-form';
import { MessageSquare } from 'lucide-react';

export default function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-12">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">We Value Your Feedback</h1>
        <p className="text-muted-foreground">
          Help us improve your shopping experience by sharing your thoughts, suggestions, or reporting any issues you've encountered.
        </p>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Why Share Feedback?</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Help us improve our services</li>
                <li>• Report technical issues</li>
                <li>• Suggest new features</li>
                <li>• Share your shopping experience</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">What Happens Next?</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Our team reviews all feedback</li>
                <li>• We'll contact you if needed</li>
                <li>• Your input helps shape improvements</li>
                <li>• Regular updates based on feedback</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6">
            <FeedbackForm />
          </div>
        </div>
      </div>
    </div>
  );
}