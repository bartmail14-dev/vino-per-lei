import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerAccessTokenDelete } from "@/lib/shopify-customer";
import { csrfErrorResponse, verifyCsrfToken } from "@/lib/server-security";

export async function POST(request: Request) {
  try {
    if (!(await verifyCsrfToken(request.headers.get("X-CSRF-Token")))) {
      return NextResponse.json(csrfErrorResponse(), { status: 403 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("vpl_customer_token")?.value;

    if (token) {
      // Revoke token in Shopify (non-blocking)
      customerAccessTokenDelete(token).catch(() => {});
      cookieStore.delete("vpl_customer_token");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[auth/logout] Error:", error);
    return NextResponse.json({ success: true });
  }
}
