import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const protectedPath = request.nextUrl.pathname.startsWith("/dashboard")
    || request.nextUrl.pathname.startsWith("/systems")
    || request.nextUrl.pathname.startsWith("/evidence")
    || request.nextUrl.pathname.startsWith("/controls")
    || request.nextUrl.pathname.startsWith("/actions")
    || request.nextUrl.pathname.startsWith("/monitoring")
    || request.nextUrl.pathname.startsWith("/reports")
    || request.nextUrl.pathname.startsWith("/settings")
    || request.nextUrl.pathname.startsWith("/vendors")
    || request.nextUrl.pathname.startsWith("/frameworks");

  if (!user && protectedPath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/systems/:path*",
    "/evidence/:path*",
    "/controls/:path*",
    "/actions/:path*",
    "/monitoring/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/vendors/:path*",
    "/frameworks/:path*",
    "/login",
  ],
};
