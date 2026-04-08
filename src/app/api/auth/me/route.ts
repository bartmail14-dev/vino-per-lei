import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCustomer } from "@/lib/shopify-customer";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("vpl_customer_token")?.value;

    if (!token) {
      return NextResponse.json({ customer: null }, { status: 401 });
    }

    const customer = await getCustomer(token);

    if (!customer) {
      // Token expired or invalid — clear cookie
      cookieStore.delete("vpl_customer_token");
      return NextResponse.json({ customer: null }, { status: 401 });
    }

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        defaultAddress: customer.defaultAddress,
        addresses: customer.addresses.edges.map((e) => e.node),
        orders: customer.orders.edges.map((e) => e.node),
      },
    });
  } catch (error) {
    console.error("[auth/me] Error:", error);
    return NextResponse.json({ customer: null }, { status: 500 });
  }
}
