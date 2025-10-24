// src/middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;

  // Skip middleware entirely for the login and logout API routes
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout")
  ) {
    return NextResponse.next();
  }

  // Only protect admin dashboard & nested routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("kc_admin")?.value;

    if (!token) {
      return NextResponse.redirect(`${origin}/admin/login`);
    }

    try {
      // Verify JWT validity
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      const res = NextResponse.redirect(`${origin}/admin/login`);
      res.cookies.delete("kc_admin"); // clean up any invalid token
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"], // covers both UI and API
};
