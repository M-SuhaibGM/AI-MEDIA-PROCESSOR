import { auth } from "@/lib/auth"

// Next.js 16 explicitly looks for a function named 'proxy' or 'default'
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

  if (isAuthPage) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", req.nextUrl));
    }
    return null;
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/auth", req.nextUrl));
  }
});
// proxy.ts or middleware.ts

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - static files (images, icons, etc.)
     * - the specific images in your public folder
     */
    '/((?!api|_next/static|_next/image|bg.jpg|google.png|favicon.ico|background.jpg|google.png|next.svg|vercel.svg|CAR.jpg|window.svg|globe.svg|file.svg).*)',
  ],
};