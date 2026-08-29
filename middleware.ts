import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const authCookie = request.cookies.get("ef_auth")?.value;
    const roleCookie = request.cookies.get("ef_user_role")?.value;

    // 1. If not authenticated, redirect to login
    if (!authCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. If trying to access user administration, verify admin role
    if (pathname.startsWith("/dashboard/usuarios")) {
      if (roleCookie !== "admin") {
        // Redirect regular users to my properties tab with an alert param
        const deniedUrl = new URL("/dashboard/propiedades", request.url);
        deniedUrl.searchParams.set("error", "admin_required");
        return NextResponse.redirect(deniedUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
