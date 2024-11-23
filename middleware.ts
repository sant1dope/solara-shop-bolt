import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
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
    "/products/(.*)",
    "/sign-in",
    "/sign-up",
  ],
  ignoredRoutes: [
    "/api/products",
    "/api/orders",
    "/api/upload",
    "/api/checkout"
  ],
  afterAuth(auth, req) {
    // Handle auth state
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return Response.redirect(signInUrl);
    }
  },
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};