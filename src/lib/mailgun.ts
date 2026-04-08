const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY ?? "";
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN ?? "";
const MAILGUN_REGION = process.env.MAILGUN_REGION ?? "eu"; // "eu" or "us"
const CONTACT_TO = process.env.CONTACT_EMAIL || "info@vinoperlei.nl";

const BASE_URL =
  MAILGUN_REGION === "eu"
    ? "https://api.eu.mailgun.net/v3"
    : "https://api.mailgun.net/v3";

interface SendMailOptions {
  to?: string;
  subject: string;
  text: string;
  replyTo?: string;
  from?: string;
}

export function isMailgunConfigured(): boolean {
  return Boolean(MAILGUN_API_KEY && MAILGUN_DOMAIN);
}

export async function sendMail(options: SendMailOptions): Promise<boolean> {
  const {
    to = CONTACT_TO,
    subject,
    text,
    replyTo,
    from = `Vino per Lei <noreply@${MAILGUN_DOMAIN}>`,
  } = options;

  const form = new FormData();
  form.append("from", from);
  form.append("to", to);
  form.append("subject", subject);
  form.append("text", text);
  if (replyTo) form.append("h:Reply-To", replyTo);

  const res = await fetch(`${BASE_URL}/${MAILGUN_DOMAIN}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
    },
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[mailgun] Send failed:", res.status, err);
    return false;
  }

  return true;
}
