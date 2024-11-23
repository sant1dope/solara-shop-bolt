'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@clerk/nextjs';

interface FeedbackFormProps {
  errorDetails?: string;
}

export default function FeedbackForm({ errorDetails }: FeedbackFormProps) {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          email: user?.emailAddresses[0]?.emailAddress || email,
          errorDetails,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({
        title: 'Thank you for your feedback!',
        description: 'We appreciate your help in improving our service.',
      });

      setMessage('');
      setEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">Your Feedback</Label>
        <Textarea
          id="message"
          placeholder="Tell us what went wrong or what we can improve..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="min-h-[100px]"
        />
      </div>

      {!user && (
        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email for follow-up"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !message}
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </form>
  );
}