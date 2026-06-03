import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

const CSRF_COOKIE = "vpl_csrf";
const SECURITY_SECRET =
  process.env.CSRF_SECRET ||
  process.env.RATE_LIMIT_SECRET ||
  process.env.SHOPIFY_WEBHOOK_SECRET ||
  "vpl-development-csrf-fallback";

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function hmac(payload: string): string {
  return createHmac("sha256", SECURITY_SECRET).update(payload).digest("base64url");
}

function verifySignedCsrfToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return false;

  const [, nonce, expires, signature] = parts;
  if (!nonce || !expires || !signature) return false;

  const expiresAt = Number(expires);
  if (!Number.isSafeInteger(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `v1.${nonce}.${expires}`;
  const expected = hmac(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export async function verifyCsrfToken(provided?: string | null): Promise<boolean> {
  if (!provided) return false;

  const cookieStore = await cookies();
  const csrfCookie = cookieStore.get(CSRF_COOKIE)?.value;
  if (!csrfCookie) return false;

  if (!constantTimeEqual(csrfCookie, provided)) return false;
  return verifySignedCsrfToken(provided);
}

export function csrfErrorResponse() {
  return {
    error: "Ongeldige sessie. Herlaad de pagina en probeer opnieuw.",
  };
}

export function stringField(body: Record<string, unknown>, key: string): string | null {
  const value = body[key];
  return typeof value === "string" ? value : null;
}

export async function readJsonBody(
  request: Request,
  maxBytes = 16 * 1024
): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; response: NextResponse }> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Ongeldig content type" },
        { status: 415 }
      ),
    };
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Payload te groot" },
        { status: 413 }
      ),
    };
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Payload te groot" },
        { status: 413 }
      ),
    };
  }

  try {
    const data = JSON.parse(text);
    return {
      ok: true,
      data: data && typeof data === "object" && !Array.isArray(data) ? data : {},
    };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Ongeldige JSON" },
        { status: 400 }
      ),
    };
  }
}

export async function readTextBody(
  request: Request,
  maxBytes = 128 * 1024
): Promise<{ ok: true; text: string } | { ok: false; response: NextResponse }> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Payload te groot" },
        { status: 413 }
      ),
    };
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Payload te groot" },
        { status: 413 }
      ),
    };
  }

  return { ok: true, text };
}

export function safeSecretEquals(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(providedBuffer, expectedBuffer);
}
