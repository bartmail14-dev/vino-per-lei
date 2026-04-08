import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerAccessTokenDelete } from "@/lib/shopify-customer";

export async function POST() {
  try {
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
