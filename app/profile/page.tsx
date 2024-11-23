import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth";
import UserProfile from "@/components/profile/user-profile";

export default async function ProfilePage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await getUserProfile();
  
  return <UserProfile />;
}