import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod/v4";
import { customerRegister, customerLogin } from "@/lib/shopify-customer";
import { isMailgunConfigured, sendMail } from "@/lib/mailgun";
import { accountWelcomeEmail } from "@/lib/email-templates";

const registerSchema = z.object({
  email: z.email("Ongeldig e-mailadres"),
  password: z.string().min(8, "Wachtwoord moet minimaal 8 tekens zijn"),
  firstName: z.string().min(1, "Voornaam is verplicht").max(100),
  lastName: z.string().min(1, "Achternaam is verplicht").max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Ongeldige invoer";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password, firstName, lastName } = parsed.data;

    // Create customer in Shopify
    const createResult = await customerRegister({ email, password, firstName, lastName });

    if ("errors" in createResult) {
      const msg = createResult.errors[0]?.message ?? "Registratie mislukt";
      const friendlyMsg = msg.includes("has already been taken")
        ? "Er bestaat al een account met dit e-mailadres"
        : msg;
      return NextResponse.json({ error: friendlyMsg }, { status: 400 });
    }

    // Auto-login after registration
    const loginResult = await customerLogin(email, password);

    if (!("errors" in loginResult)) {
      const cookieStore = await cookies();
      const expiresAt = new Date(loginResult.expiresAt);
      cookieStore.set("vpl_customer_token", loginResult.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
      });
    }

    // Send welcome email (non-blocking)
    if (isMailgunConfigured()) {
      const template = await accountWelcomeEmail(firstName);
      sendMail({
        to: email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      }).catch((err) => console.error("[auth/register] Welcome email failed:", err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[auth/register] Error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het later opnieuw." },
      { status: 500 }
    );
  }
}
