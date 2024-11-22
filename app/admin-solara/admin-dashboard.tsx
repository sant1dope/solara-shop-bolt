'use client';

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Order } from "./columns";

interface AdminDashboardProps {
  orders: Order[];
}

export function AdminDashboard({ orders }: AdminDashboardProps) {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>
      <div className="overflow-hidden">
        <DataTable columns={columns} data={orders} />
      </div>
    </div>
  );
}