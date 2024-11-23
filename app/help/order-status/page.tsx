'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function OrderStatusPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/orders/status?orderId=${orderId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch order status');
      }

      setOrderStatus(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch order status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl mt-12">
      <h1 className="text-3xl font-bold text-center mb-2">View or Manage Your Order</h1>
      <p className="text-center text-muted-foreground mb-8">
        To check the status of your order, or to start a return, please enter your order number and
        email address.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="text"
            placeholder="Order Number*"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Checking...' : 'Check Status'}
        </Button>
      </form>

      {orderStatus && (
        <div className="mt-8 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Customer Name:</span> {orderStatus.customerName}
            </p>
            <p>
              <span className="font-medium">Status:</span> {orderStatus.status}
            </p>
            <p>
              <span className="font-medium">Order Date:</span>{' '}
              {new Date(orderStatus.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Total Amount:</span> ₱{orderStatus.totalAmount}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}