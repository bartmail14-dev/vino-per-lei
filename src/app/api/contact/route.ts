import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod/v4";
import { isMailgunConfigured, sendMail } from "@/lib/mailgun";
import { contactConfirmationEmail } from "@/lib/email-templates";

const contactSchema = z.object({
  naam: z.string().min(2, "Naam is te kort").max(200, "Naam is te lang"),
  email: z.email("Ongeldig e-mailadres"),
  onderwerp: z.string().min(1, "Kies een onderwerp").max(200, "Onderwerp is te lang"),
  bericht: z.string().min(10, "Bericht is te kort").max(2000, "Bericht is te lang"),
  honeypot: z.string().optional(),
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

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Ongeldige invoer";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { naam, email, onderwerp, bericht, honeypot } = parsed.data;

    // Bot check — return fake success to not reveal honeypot
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!isMailgunConfigured()) {
      console.warn("[contact] Mailgun niet geconfigureerd — MAILGUN_API_KEY of MAILGUN_DOMAIN ontbreekt.");
      return NextResponse.json(
        { error: "E-mail service is nog niet geconfigureerd" },
        { status: 503 },
      );
    }

    const ok = await sendMail({
      subject: `Vino per Lei — ${onderwerp}`,
      replyTo: email,
      text: [
        `Naam: ${naam}`,
        `E-mail: ${email}`,
        `Onderwerp: ${onderwerp}`,
        "",
        bericht,
      ].join("\n"),
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Verzending mislukt. Probeer het later opnieuw." },
        { status: 500 },
      );
    }

    // Send confirmation to sender (non-blocking)
    const confirmation = await contactConfirmationEmail(naam);
    sendMail({
      to: email,
      subject: confirmation.subject,
      text: confirmation.text,
      html: confirmation.html,
    }).catch((err) => console.error("[contact] Confirmation email failed:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis" },
      { status: 500 },
    );
  }
}
