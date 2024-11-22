import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, MoreHorizontal, FileText, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type Order = {
  orderId: string;
  date: string;
  customerName: string;
  email: string;
  contactNumber: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  status: OrderStatus;
  receiptUrl: string;
};

async function sendInvoice(orderId: string) {
  try {
    const response = await fetch('/api/admin/orders/send-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) throw new Error('Failed to send invoice');
    
    alert('Invoice sent successfully!');
  } catch (error) {
    console.error('Error sending invoice:', error);
    alert('Failed to send invoice');
  }
}

async function sendThankYouEmail(orderId: string) {
  try {
    const response = await fetch('/api/admin/orders/send-thank-you', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) throw new Error('Failed to send thank you email');
    
    alert('Thank you email sent successfully!');
  } catch (error) {
    console.error('Error sending thank you email:', error);
    alert('Failed to send thank you email');
  }
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => {
      return (
        <Link 
          href={`/admin-solara/orders/${row.getValue("orderId")}`}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          {row.getValue("orderId")}
          <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("date")), "MMM d, yyyy");
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span>{row.getValue("customerName")}</span>
          <span className="text-sm text-muted-foreground">{row.original.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      return formatPrice(row.getValue("totalAmount"));
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus;
      return (
        <Badge
          className={
            status === "Delivered"
              ? "bg-green-500"
              : status === "Processing"
              ? "bg-blue-500"
              : status === "Shipped"
              ? "bg-purple-500"
              : status === "Cancelled"
              ? "bg-red-500"
              : "bg-yellow-500"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => sendInvoice(order.orderId)}
              className="cursor-pointer"
            >
              <FileText className="mr-2 h-4 w-4" />
              Send Invoice
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => sendThankYouEmail(order.orderId)}
              className="cursor-pointer"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Thank You
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];