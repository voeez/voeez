import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { checkoutRatelimit, statsRatelimit } from "@/lib/ratelimit";

/** Best-effort IP extraction for Vercel / standard proxies */
function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}

/** Return a 429 JSON response with rate-limit headers */
function rateLimitExceeded(limit: number, remaining: number, reset: number) {
  return NextResponse.json(
    { error: "Zu viele Anfragen. Bitte warte einen Moment." },
    {
      status: 429,
      headers: {
        "Retry-After":            String(Math.ceil((reset - Date.now()) / 1000)),
        "X-RateLimit-Limit":      String(limit),
        "X-RateLimit-Remaining":  String(remaining),
      },
    }
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ── Rate limiting ──────────────────────────────────────────────────
  // Applied before the Supabase session refresh to block bad actors early.

  if (
    checkoutRatelimit &&
    (pathname.startsWith("/api/stripe/checkout") ||
      pathname.startsWith("/api/stripe/portal"))
  ) {
    const { success, limit, remaining, reset } =
      await checkoutRatelimit.limit(getIp(request));
    if (!success) return rateLimitExceeded(limit, remaining, reset);
  }

  if (statsRatelimit && pathname.startsWith("/api/sync/stats")) {
    const { success, limit, remaining, reset } =
      await statsRatelimit.limit(getIp(request));
    if (!success) return rateLimitExceeded(limit, remaining, reset);
  }

  // ── Supabase session refresh ───────────────────────────────────────
  const supabaseUrl    = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured, allow all routes through
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh the session (important for keeping the session alive)
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase unreachable (wrong URL/key) — fail open, protect /dashboard
  }

  // Protect /dashboard routes - redirect to /login if not authenticated
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from login/signup pages
  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
