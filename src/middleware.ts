import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// --- Cookie-based rate limiter ---
// On Vercel serverless, in-memory state is NOT shared between instances.
// This cookie-based approach tracks request timestamps per client.
// It is NOT bulletproof (cookies can be cleared by the client), but provides
// basic protection without external dependencies like Upstash Redis or Vercel KV.
//
// For production-grade rate limiting, consider:
// - Upstash Redis (@upstash/ratelimit)
// - Vercel KV
// - Cloudflare Rate Limiting
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_COOKIE = "__rl";

// HMAC-like signing using a simple hash to prevent cookie tampering.
// Uses a server-side secret so clients cannot forge valid timestamps.
// If RATE_LIMIT_SECRET is not set, a random fallback is generated per instance.
// This means cookies won't survive across deploys/instances, but it's safe.
const RATE_LIMIT_SECRET = (() => {
  const envSecret = process.env.RATE_LIMIT_SECRET;
  if (envSecret) return envSecret;
  console.warn(
    "[middleware] RATE_LIMIT_SECRET env var is not set. Using a random per-instance fallback. " +
    "Set RATE_LIMIT_SECRET for consistent cookie signing across instances."
  );
  return crypto.randomUUID();
})();

function simpleHash(data: string): string {
  let hash = 0;
  const str = data + RATE_LIMIT_SECRET;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36);
}

function signPayload(payload: string): string {
  return `${payload}.${simpleHash(payload)}`;
}

function verifyAndParse(cookie: string): number[] | null {
  const lastDot = cookie.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = cookie.substring(0, lastDot);
  const sig = cookie.substring(lastDot + 1);
  if (simpleHash(payload) !== sig) return null;
  try {
    const timestamps = JSON.parse(payload);
    if (!Array.isArray(timestamps)) return null;
    return timestamps.filter((t): t is number => typeof t === "number");
  } catch {
    return null;
  }
}

function checkRateLimit(
  request: NextRequest,
  response: NextResponse
): { limited: boolean; response: NextResponse } {
  const now = Date.now();
  const cookieValue = request.cookies.get(RATE_LIMIT_COOKIE)?.value;

  // Parse existing timestamps from signed cookie
  let timestamps: number[] = [];
  if (cookieValue) {
    const parsed = verifyAndParse(cookieValue);
    if (parsed) {
      // Keep only timestamps within the current window
      timestamps = parsed.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    }
  }

  // Check if rate limited
  if (timestamps.length >= RATE_LIMIT_MAX) {
    const errorResponse = NextResponse.json(
      { error: "Te veel verzoeken. Probeer het over een minuut opnieuw." },
      { status: 429 }
    );
    return { limited: true, response: errorResponse };
  }

  // Add current timestamp and sign
  timestamps.push(now);
  const signed = signPayload(JSON.stringify(timestamps));
  response.cookies.set(RATE_LIMIT_COOKIE, signed, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    path: "/api",
  });

  return { limited: false, response };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  // --- Security headers ---
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // --- X-Robots-Tag: noindex for API routes ---
  // Prevents search engines from indexing API endpoints
  if (pathname.startsWith("/api/")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // --- CSP ---
  // NOTE: 'unsafe-inline' is required for both script-src and style-src:
  // - style-src: Tailwind v4 injects styles at runtime via <style> tags
  // - script-src: Next.js uses inline <script> tags for hydration data
  // These cannot be replaced with nonces without custom Next.js config.
  // DO NOT add 'unsafe-eval' — it is not needed and weakens CSP significantly.
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

  // --- Rate limiting for API form routes ---
  if (pathname.startsWith("/api/contact") || pathname.startsWith("/api/newsletter")) {
    const { limited, response: rlResponse } = checkRateLimit(request, response);
    if (limited) return rlResponse;
    return rlResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|showcase.*).*)",
  ],
};
