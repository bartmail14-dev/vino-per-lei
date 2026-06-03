import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod/v4";
import { customerLogin } from "@/lib/shopify-customer";
import { csrfErrorResponse, readJsonBody, verifyCsrfToken } from "@/lib/server-security";

const loginSchema = z.object({
  email: z.email("Ongeldig e-mailadres"),
  password: z.string().min(1, "Wachtwoord is verplicht"),
  _csrf: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const bodyResult = await readJsonBody(request, 8 * 1024);
    if (!bodyResult.ok) return bodyResult.response;
    const body = bodyResult.data;
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Ongeldige invoer";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password, _csrf } = parsed.data;
    if (!(await verifyCsrfToken(_csrf))) {
      return NextResponse.json(csrfErrorResponse(), { status: 403 });
    }

    const result = await customerLogin(email, password);

    if ("errors" in result) {
      // Shopify returns "Unidentified customer" for wrong email/password
      const msg = result.errors[0]?.message ?? "Inloggen mislukt";
      const friendlyMsg = msg.includes("Unidentified")
        ? "E-mailadres of wachtwoord is onjuist"
        : msg;
      return NextResponse.json({ error: friendlyMsg }, { status: 401 });
    }

    // Store access token in httpOnly cookie
    const cookieStore = await cookies();
    const expiresAt = new Date(result.expiresAt);
    cookieStore.set("vpl_customer_token", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: expiresAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[auth/login] Error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het later opnieuw." },
      { status: 500 }
    );
  }
}
