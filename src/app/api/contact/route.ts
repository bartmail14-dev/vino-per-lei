import { NextResponse } from "next/server";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY!;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN!;
const CONTACT_TO = process.env.CONTACT_EMAIL || "info@vinoperlei.nl";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { naam, email, onderwerp, bericht, honeypot } = body;

    // Bot check
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    // Validation
    if (!naam || naam.length < 2) {
      return NextResponse.json({ error: "Naam is te kort" }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Ongeldig e-mailadres" }, { status: 400 });
    }
    if (!onderwerp) {
      return NextResponse.json({ error: "Kies een onderwerp" }, { status: 400 });
    }
    if (!bericht || bericht.length < 10) {
      return NextResponse.json({ error: "Bericht is te kort" }, { status: 400 });
    }

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.error("Mailgun environment variables not configured");
      return NextResponse.json(
        { error: "Server configuratie fout" },
        { status: 500 },
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
