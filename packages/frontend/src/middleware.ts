import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value || "";
  const { pathname, origin } = req.nextUrl;
  const valid = decodeToken(token);

  if (!valid) {
    // If the token is invalid and user already on the sign-in page then we do nothing,
    // redirect to /auth/login otherwise
    if (pathname !== "/auth/login") {
      const loginUrl = new NextURL("/auth/login", origin);
      return NextResponse.redirect(loginUrl);
    }
  } else {
    // If token is valid and trying to access sign-in, redirect to dashboard
    if (pathname === "/auth/login") {
      const dashboardUrl = new NextURL("/dashboard", origin);
      return NextResponse.redirect(dashboardUrl);
    }
  }
}

// Make sure matcher covers all protected routes
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*", // Protect dashboard route and sub-routes
    "/auth/login",
  ],
};

// interface for token payload
interface JwtPayload {
  exp?: number;
}

// function to decode token validity
function decodeToken(token: string): boolean {
  try {
    if (!token) return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    const decodedToken = JSON.parse(jsonPayload) as JwtPayload;

    if (!decodedToken || !decodedToken.exp) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  } catch (err) {
    console.error("Token decoding error:", err);
    return false;
  }
}
