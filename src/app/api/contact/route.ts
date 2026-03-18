import { NextResponse } from "next/server";
import { z } from "zod/v4";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY ?? "";
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN ?? "";
const CONTACT_TO = process.env.CONTACT_EMAIL || "info@vinoperlei.nl";

// Check if Mailgun credentials are real (not placeholder values from .env.example)
function isMailgunConfigured(): boolean {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) return false;
  if (MAILGUN_API_KEY.includes("your-mailgun") || MAILGUN_API_KEY === "your-mailgun-api-key") return false;
  if (MAILGUN_DOMAIN.includes("your-") || MAILGUN_DOMAIN === "your-mailgun-domain.com") return false;
  return true;
}

const contactSchema = z.object({
  naam: z.string().min(2, "Naam is te kort").max(200, "Naam is te lang"),
  email: z.email("Ongeldig e-mailadres"),
  onderwerp: z.string().min(1, "Kies een onderwerp").max(200, "Onderwerp is te lang"),
  bericht: z.string().min(10, "Bericht is te kort").max(2000, "Bericht is te lang"),
  honeypot: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
      console.warn(
        "[contact] Mailgun is niet geconfigureerd — API keys zijn placeholders of ontbreken. " +
        "Stel MAILGUN_API_KEY en MAILGUN_DOMAIN in met echte waarden."
      );
      return NextResponse.json(
        { error: "E-mail service is nog niet geconfigureerd" },
        { status: 503 },
      );
    }

    const response = await fetch(
      `https://api.eu.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          from: `Vino per Lei <noreply@${MAILGUN_DOMAIN}>`,
          to: CONTACT_TO,
          "h:Reply-To": email,
          subject: `Vino per Lei — ${onderwerp}`,
          text: [
            `Naam: ${naam}`,
            `E-mail: ${email}`,
            `Onderwerp: ${onderwerp}`,
            "",
            "Bericht:",
            bericht,
          ].join("\n"),
          html: [
            `<h2>Nieuw contactformulier</h2>`,
            `<p><strong>Naam:</strong> ${escapeHtml(naam)}</p>`,
            `<p><strong>E-mail:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`,
            `<p><strong>Onderwerp:</strong> ${escapeHtml(onderwerp)}</p>`,
            `<hr>`,
            `<p>${escapeHtml(bericht).replace(/\n/g, "<br>")}</p>`,
          ].join("\n"),
        }),
      },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.error("Mailgun send error:", data);
      return NextResponse.json(
        { error: "Verzending mislukt. Probeer het later opnieuw." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis" },
      { status: 500 },
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
