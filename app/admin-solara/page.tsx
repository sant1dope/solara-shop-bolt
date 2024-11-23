import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AdminDashboard } from "./admin-dashboard";
import { getOrders } from "./actions";
import { isAdmin } from "@/lib/auth";

export default async function AdminPage() {
  // Check if user is authenticated
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user is admin - add await here
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    redirect("/unauthorized");
  }

  const orders = await getOrders();
  return <AdminDashboard orders={orders} />;
}