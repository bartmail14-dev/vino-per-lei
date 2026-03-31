import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  productTitle: z.string().min(1).max(200),
});

const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, productTitle } = schema.parse(body);

    if (!WEB3FORMS_KEY || WEB3FORMS_KEY === "your-web3forms-key") {
      // Fallback: log to console when key not configured
      console.log(`[notify-me] ${email} wants notification for: ${productTitle}`);
      return NextResponse.json({ success: true });
    }

    // Send notification via Web3Forms (same service as contact form)
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Voorraadmelding: ${productTitle}`,
        from_name: "Vino per Lei — Voorraadmelding",
        email,
        message: `${email} wil een melding ontvangen wanneer "${productTitle}" weer op voorraad is.`,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
