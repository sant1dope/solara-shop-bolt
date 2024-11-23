import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Paid";

export type Order = {
  orderId: string;
  date: string;
  status: OrderStatus;
  totalAmount: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => {
      return (
        <Link 
          href={`/profile/orders/${row.getValue("orderId")}`}
          className="flex items-center text-primary hover:text-primary/80"
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
              : status === "Paid"
              ? "bg-emerald-500"
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
];