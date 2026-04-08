import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { customerRecover } from "@/lib/shopify-customer";

const recoverSchema = z.object({
  email: z.email("Ongeldig e-mailadres"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = recoverSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Ongeldige invoer";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email } = parsed.data;
    await customerRecover(email);

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "Als er een account bestaat met dit e-mailadres, ontvang je een e-mail met instructies.",
    });
  } catch (error) {
    console.error("[auth/recover] Error:", error);
    // Still return success to prevent enumeration
    return NextResponse.json({
      success: true,
      message: "Als er een account bestaat met dit e-mailadres, ontvang je een e-mail met instructies.",
    });
  }
}
