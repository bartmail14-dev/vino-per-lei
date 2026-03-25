import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod/v4";

const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY ?? "";
const CONTACT_TO = process.env.CONTACT_EMAIL || "info@vinoperlei.nl";

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

    if (!WEB3FORMS_KEY) {
      console.warn(
        "[contact] Web3Forms is niet geconfigureerd — WEB3FORMS_ACCESS_KEY ontbreekt. " +
        "Maak een account op web3forms.com en stel de key in."
      );
      return NextResponse.json(
        { error: "E-mail service is nog niet geconfigureerd" },
        { status: 503 },
      );
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Vino per Lei — ${onderwerp}`,
        from_name: naam,
        replyto: email,
        to: CONTACT_TO,
        naam,
        email,
        onderwerp,
        bericht,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("Web3Forms send error:", data);
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
