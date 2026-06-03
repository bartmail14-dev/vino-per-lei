import { NextResponse } from "next/server";
import { z } from "zod";
import { isMailgunConfigured, sendMail } from "@/lib/mailgun";
import { notifyMeConfirmationEmail } from "@/lib/email-templates";
import { csrfErrorResponse, readJsonBody, stringField, verifyCsrfToken } from "@/lib/server-security";

const schema = z.object({
  email: z.string().email(),
  productTitle: z.string().min(1).max(200),
  productImageUrl: z.string().url().optional(),
  productHandle: z.string().optional(),
  _csrf: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const bodyResult = await readJsonBody(request, 8 * 1024);
    if (!bodyResult.ok) return bodyResult.response;
    const body = bodyResult.data;

    if (!(await verifyCsrfToken(stringField(body, "_csrf")))) {
      return NextResponse.json(csrfErrorResponse(), { status: 403 });
    }

    const { email, productTitle, productImageUrl, productHandle } = schema.parse(body);

    if (!isMailgunConfigured()) {
      console.warn("[notify-me] Mailgun is niet geconfigureerd; voorraadmelding is niet verstuurd.");
      return NextResponse.json({ success: true });
    }

    // Notify shop owner
    const ok = await sendMail({
      subject: `Voorraadmelding: ${productTitle}`,
      text: `${email} wil een melding ontvangen wanneer "${productTitle}" weer op voorraad is.`,
    });

    if (!ok) {
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }

    // Send confirmation to customer (non-blocking)
    const confirmation = await notifyMeConfirmationEmail(productTitle, productImageUrl, productHandle);
    sendMail({
      to: email,
      subject: confirmation.subject,
      text: confirmation.text,
      html: confirmation.html,
    }).catch((err) => console.error("[notify-me] Confirmation email failed:", err));

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
