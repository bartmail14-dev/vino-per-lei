"use client";

export function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)vpl_csrf=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export function safeInternalPath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return null;
  }

  try {
    const parsed = new URL(value, window.location.origin);
    if (parsed.origin !== window.location.origin) return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}
