import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/admin/posts"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("access_token")?.value;

  if (
    PROTECTED_ROUTES.some((route) => url.pathname.startsWith(route)) &&
    !token
  ) {
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  if (url.pathname === "/admin" && token) {
    url.pathname = "/admin/posts";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
