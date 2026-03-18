import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// --- In-memory rate limiter ---
// Tracks request counts per IP for API routes (contact, newsletter).
// Max 5 requests per IP per 60 seconds.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

// Periodically clean up stale entries to prevent memory leaks
if (typeof globalThis !== "undefined") {
  const CLEANUP_INTERVAL = 5 * 60_000; // 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Rate limiting for API routes ---
  if (pathname.startsWith("/api/contact") || pathname.startsWith("/api/newsletter")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Te veel verzoeken. Probeer het over een minuut opnieuw." },
        { status: 429 }
      );
    }
  }

  const response = NextResponse.next();

  // --- Security headers ---
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // CSP: unsafe-inline is required for style-src (Tailwind v4 injects styles at runtime).
  // script-src uses strict-dynamic where possible; unsafe-inline is kept as fallback
  // for Next.js inline script tags (hydration data).
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://cdn.shopify.com https://images.unsplash.com",
      "font-src 'self'",
      "connect-src 'self' https://*.myshopify.com",
      "media-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://*.myshopify.com",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ") + ";"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
