import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  // Only protect admin routes
  publicRoutes: [
    "/",
    "/shop",
    "/cart",
    "/checkout",
    "/payment",
    "/thank-you",
    "/help/(.*)",
    "/api/products",
    "/api/orders",
    "/api/upload",
    "/api/checkout",
    "/product/(.*)"
  ],
  ignoredRoutes: [
    "/api/products",
    "/api/orders",
    "/api/upload",
    "/api/checkout"
  ]
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};