import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod/v4";
import { sendMail } from "@/lib/mailgun";
import { newsletterWelcomeEmail } from "@/lib/email-templates";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY ?? "";
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN ?? "";
const MAILGUN_LIST = process.env.MAILGUN_LIST || `newsletter@${MAILGUN_DOMAIN}`;

// Check if Mailgun credentials are real (not placeholder values from .env.example)
function isMailgunConfigured(): boolean {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) return false;
  if (MAILGUN_API_KEY.includes("your-mailgun") || MAILGUN_API_KEY === "your-mailgun-api-key") return false;
  if (MAILGUN_DOMAIN.includes("your-") || MAILGUN_DOMAIN === "your-mailgun-domain.com") return false;
  return true;
}

const newsletterSchema = z.object({
  email: z.email("Ongeldig e-mailadres"),
  _csrf: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // --- CSRF validation ---
    const cookieStore = await cookies();
    const csrfCookie = cookieStore.get("vpl_csrf")?.value;
    const csrfBody = body?._csrf;
    if (!csrfCookie || !csrfBody || csrfCookie !== csrfBody) {
      return NextResponse.json(
        { error: "Ongeldige sessie. Herlaad de pagina en probeer opnieuw." },
        { status: 403 }
      );
    }

    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Ongeldige invoer";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email } = parsed.data;

    if (!isMailgunConfigured()) {
      console.warn(
        "[newsletter] Mailgun is niet geconfigureerd — API keys zijn placeholders of ontbreken. " +
        "Stel MAILGUN_API_KEY en MAILGUN_DOMAIN in met echte waarden."
      );
      return NextResponse.json(
        { error: "E-mail service is nog niet geconfigureerd" },
        { status: 503 },
      );
    }

    // Add subscriber to Mailgun mailing list
    const response = await fetch(
      `https://api.eu.mailgun.net/v3/lists/${MAILGUN_LIST}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          address: email,
          subscribed: "yes",
          upsert: "yes",
        }),
      },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.error("Mailgun list error:", data);
      return NextResponse.json(
        { error: "Aanmelding mislukt. Probeer het later opnieuw." },
        { status: 500 },
      );
    }

    // Send welcome email (non-blocking)
    const welcome = newsletterWelcomeEmail();
    sendMail({
      to: email,
      subject: welcome.subject,
      text: welcome.text,
      html: welcome.html,
    }).catch((err) => console.error("[newsletter] Welcome email failed:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis" },
      { status: 500 },
    );
  }
}
