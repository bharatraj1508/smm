import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // localStorage is not available on the server. Use cookies instead.
  const accessToken = req.cookies.get("accessToken")?.value;
  const isAuthenticated = !!accessToken;

  const protectedRoutePrefixes = ["/dashboard", "/settings"];

  const { pathname } = req.nextUrl;

  // See if route is protected
  const isProtected = protectedRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (!isAuthenticated && isProtected) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Make sure matcher covers all protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};
