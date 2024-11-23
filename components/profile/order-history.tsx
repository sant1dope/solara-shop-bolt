'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./order-columns";
import { Order } from "@/types/order";
import Link from 'next/link';

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.emailAddresses?.[0]?.emailAddress) return;

      try {
        const response = await fetch(`/api/user/orders?email=${user.emailAddresses[0].emailAddress}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No orders found</p>
        <Link href="/shop" className="text-primary hover:underline mt-2 inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return <DataTable columns={columns} data={orders} />;
}