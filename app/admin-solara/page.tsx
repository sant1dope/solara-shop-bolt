import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AdminDashboard } from "./admin-dashboard";
import { getOrders } from "./actions";

export default async function AdminPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const orders = await getOrders();

  return <AdminDashboard orders={orders} />;
}