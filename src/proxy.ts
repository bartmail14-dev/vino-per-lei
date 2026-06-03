import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// --- Age-restricted paths ---
// These routes require the `vpl_age_verified` cookie to be present.
// If missing, the user is redirected to the homepage where the AgeGate component handles verification.
const AGE_RESTRICTED_PATHS = ["/wijnen", "/checkout"];
const PRIVATE_MANUAL_PATHS = ["/handleiding", "/beheer/"];

function isAgeRestrictedPath(pathname: string): boolean {
  return AGE_RESTRICTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isPrivateManualPath(pathname: string): boolean {
  return PRIVATE_MANUAL_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p)
  );
}

// --- CSRF token generation ---
const CSRF_COOKIE = "vpl_csrf";
const CSRF_TTL_SECONDS = 60 * 60 * 24;

async function ensureCsrfToken(
  request: NextRequest,
  response: NextResponse
): Promise<string> {
  const existing = request.cookies.get(CSRF_COOKIE)?.value;
  if (isSignedCsrfToken(existing)) {
    // Expose token via response header so client JS can read it
    response.headers.set("X-CSRF-Token", existing);
    return existing;
  }

  const token = await createSignedCsrfToken();
  // Not httpOnly — client JS must read this token to include it in form submissions.
  // Security uses an HMAC-signed double-submit token: cookie and submitted value
  // must match, and the signature/expiry must verify server-side.
  response.cookies.set(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: CSRF_TTL_SECONDS,
  });
  response.headers.set("X-CSRF-Token", token);
  return token;
}

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

// HMAC-SHA256 signing prevents clients from forging rate-limit timestamps.
// If RATE_LIMIT_SECRET is not set, a random fallback is generated per instance.
// This means cookies won't survive across deploys/instances, but it's safe.
const RATE_LIMIT_SECRET = (() => {
  const envSecret = process.env.RATE_LIMIT_SECRET;
  if (envSecret) return envSecret;
  console.warn(
    "[proxy] RATE_LIMIT_SECRET env var is not set. Using a random per-instance fallback. " +
    "Set RATE_LIMIT_SECRET for consistent cookie signing across instances."
  );
  return crypto.randomUUID();
})();

const SECURITY_SECRET =
  process.env.CSRF_SECRET ||
  process.env.RATE_LIMIT_SECRET ||
  process.env.SHOPIFY_WEBHOOK_SECRET ||
  "vpl-development-csrf-fallback";

function isSignedCsrfToken(value: string | undefined): value is string {
  return Boolean(value && value.startsWith("v1.") && value.split(".").length === 4);
}

async function createSignedCsrfToken(): Promise<string> {
  const nonce = crypto.randomUUID().replaceAll("-", "") + crypto.randomUUID().replaceAll("-", "");
  const expires = Math.floor(Date.now() / 1000) + CSRF_TTL_SECONDS;
  const payload = `v1.${nonce}.${expires}`;
  return `${payload}.${await hmacWithSecret(payload, SECURITY_SECRET)}`;
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function hmac(payload: string): Promise<string> {
  return hmacWithSecret(payload, RATE_LIMIT_SECRET);
}

async function hmacWithSecret(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function signPayload(payload: string): Promise<string> {
  return `${payload}.${await hmac(payload)}`;
}

async function verifyAndParse(cookie: string): Promise<number[] | null> {
  const lastDot = cookie.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = cookie.substring(0, lastDot);
  const sig = cookie.substring(lastDot + 1);
  const expected = await hmac(payload);
  if (!constantTimeEqual(expected, sig)) return null;
  try {
    const timestamps = JSON.parse(payload);
    if (!Array.isArray(timestamps)) return null;
    return timestamps.filter((t): t is number => typeof t === "number");
  } catch {
    return null;
  }
}

function isMutatingApiRequest(request: NextRequest): boolean {
  return (
    request.nextUrl.pathname.startsWith("/api/") &&
    request.nextUrl.pathname !== "/api/revalidate" &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)
  );
}

function isSameOriginRequest(request: NextRequest): boolean {
  const expectedOrigin = request.nextUrl.origin;
  const origin = request.headers.get("origin");
  if (origin) return origin === expectedOrigin;

  const referer = request.headers.get("referer");
  if (!referer) return false;

  try {
    return new URL(referer).origin === expectedOrigin;
  } catch {
    return false;
  }
}

async function checkRateLimit(
  request: NextRequest,
  response: NextResponse
): Promise<{ limited: boolean; response: NextResponse }> {
  const now = Date.now();
  const cookieValue = request.cookies.get(RATE_LIMIT_COOKIE)?.value;

  // Parse existing timestamps from signed cookie
  let timestamps: number[] = [];
  if (cookieValue) {
    const parsed = await verifyAndParse(cookieValue);
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
    return { limited: true, response: applySecurityHeaders(request, errorResponse) };
  }

  // Add current timestamp and sign
  timestamps.push(now);
  const signed = await signPayload(JSON.stringify(timestamps));
  response.cookies.set(RATE_LIMIT_COOKIE, signed, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    path: "/api",
  });

  return { limited: false, response };
}

function applySecurityHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const pathname = request.nextUrl.pathname;

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  if (pathname.startsWith("/api/") || isPrivateManualPath(pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  if (pathname.startsWith("/api/auth/") || pathname === "/account") {
    response.headers.set("Cache-Control", "no-store");
  }

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "script-src-attr 'none'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://cdn.shopify.com https://images.unsplash.com https://vino-per-lei.vercel.app https://*.vinoperlei.nl",
      "font-src 'self'",
      "connect-src 'self' https://*.myshopify.com",
      "media-src 'self'",
      "manifest-src 'self'",
      "worker-src 'self' blob:",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://*.myshopify.com",
      "object-src 'none'",
      "upgrade-insecure-requests",
      "report-uri /api/csp-report",
    ].join("; ") + ";"
  );

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/handleiding" || pathname === "/handleiding/") {
    return applySecurityHeaders(request, new NextResponse(null, {
      status: 410,
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
      },
    }));
  }

  // --- Age verification gate (server-side) ---
  // Redirect to homepage if age cookie is missing on restricted routes.
  // The client-side AgeGate component on "/" handles the actual verification UI.
  if (isAgeRestrictedPath(pathname)) {
    const ageVerified = request.cookies.get("vpl_age_verified")?.value;
    if (!ageVerified) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("age_required", "1");
      url.searchParams.set("return_to", pathname);
      return applySecurityHeaders(request, NextResponse.redirect(url));
    }
  }

  const response = NextResponse.next();

  // --- CSRF token (generate per session, expose via header) ---
  await ensureCsrfToken(request, response);

  if (isMutatingApiRequest(request) && !isSameOriginRequest(request)) {
    return applySecurityHeaders(request, NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  // --- Security headers ---
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // --- X-Robots-Tag: noindex for API routes ---
  // Prevents search engines from indexing API endpoints
  if (pathname.startsWith("/api/") || isPrivateManualPath(pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  if (pathname.startsWith("/api/auth/") || pathname === "/account") {
    response.headers.set("Cache-Control", "no-store");
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
      "script-src-attr 'none'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://cdn.shopify.com https://images.unsplash.com https://vino-per-lei.vercel.app https://*.vinoperlei.nl",
      "font-src 'self'",
      "connect-src 'self' https://*.myshopify.com",
      "media-src 'self'",
      "manifest-src 'self'",
      "worker-src 'self' blob:",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://*.myshopify.com",
      "object-src 'none'",
      "upgrade-insecure-requests",
      "report-uri /api/csp-report",
    ].join("; ") + ";"
  );

  // --- Rate limiting for API form routes ---
  if (
    pathname.startsWith("/api/contact") ||
    pathname.startsWith("/api/newsletter") ||
    pathname.startsWith("/api/notify-me") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/register") ||
    pathname.startsWith("/api/auth/recover")
  ) {
    const { limited, response: rlResponse } = await checkRateLimit(request, response);
    if (limited) return rlResponse;
    return rlResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
