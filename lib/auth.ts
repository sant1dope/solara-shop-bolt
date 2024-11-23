import { auth, currentUser } from "@clerk/nextjs";

export async function isAdmin() {
  const user = await currentUser();
  if (!user) return false;

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || [];
  
  if (adminEmails.length === 0) {
    console.warn('No admin emails configured in environment variables');
    return false;
  }

  // Get primary email
  const primaryEmail = user.emailAddresses.find(
    email => email.id === user.primaryEmailAddressId
  )?.emailAddress?.toLowerCase();

  return primaryEmail ? adminEmails.includes(primaryEmail) : false;
}

export async function getUserEmail() {
  const user = await currentUser();
  if (!user) return null;

  return user.emailAddresses.find(
    email => email.id === user.primaryEmailAddressId
  )?.emailAddress || null;
}

export async function getUserProfile() {
  const user = await currentUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.emailAddresses.find(
      email => email.id === user.primaryEmailAddressId
    )?.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
  };
}