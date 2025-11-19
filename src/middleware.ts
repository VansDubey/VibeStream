import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Protected routes
  const protectedRoutes = ["/profile"];

  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    // If not logged in, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/Login", request.url));
    }
  }

  // If already logged in and trying to access Login page → send to home
  if (request.nextUrl.pathname === "/Login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/Login",
    "/Logout"
  ],
};
