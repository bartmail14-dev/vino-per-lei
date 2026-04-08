import { NextResponse } from "next/server";
import { z } from "zod";
import { isMailgunConfigured, sendMail } from "@/lib/mailgun";
import { notifyMeConfirmationEmail } from "@/lib/email-templates";

const schema = z.object({
  email: z.string().email(),
  productTitle: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, productTitle } = schema.parse(body);

    if (!isMailgunConfigured()) {
      console.log(`[notify-me] ${email} wants notification for: ${productTitle}`);
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
    const confirmation = notifyMeConfirmationEmail(productTitle);
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
