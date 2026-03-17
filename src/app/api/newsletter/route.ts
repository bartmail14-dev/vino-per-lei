import { NextResponse } from "next/server";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY!;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN!;
const MAILGUN_LIST = process.env.MAILGUN_LIST || `newsletter@${MAILGUN_DOMAIN}`;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres" },
        { status: 400 },
      );
    }

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.error("Mailgun environment variables not configured");
      return NextResponse.json(
        { error: "Server configuratie fout" },
        { status: 500 },
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis" },
      { status: 500 },
    );
  }
}
