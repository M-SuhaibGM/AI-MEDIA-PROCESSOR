import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthPage = nextUrl.pathname.startsWith("/auth");
  const isPublicRoute = nextUrl.pathname === "/"; // Add other public routes here

  // 1. If on Auth page and logged in, go to home
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // 2. If not logged in and not on a public/auth page, go to auth
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth", nextUrl));
  }

  return NextResponse.next();
});
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