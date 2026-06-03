import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { customerRecover } from "@/lib/shopify-customer";
import { csrfErrorResponse, readJsonBody, verifyCsrfToken } from "@/lib/server-security";

const recoverSchema = z.object({
  email: z.email("Ongeldig e-mailadres"),
  _csrf: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const bodyResult = await readJsonBody(request, 4 * 1024);
    if (!bodyResult.ok) return bodyResult.response;
    const body = bodyResult.data;
    const parsed = recoverSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Ongeldige invoer";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, _csrf } = parsed.data;
    if (!(await verifyCsrfToken(_csrf))) {
      return NextResponse.json(csrfErrorResponse(), { status: 403 });
    }

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
