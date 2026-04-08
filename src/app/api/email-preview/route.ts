import { NextResponse } from "next/server";
import {
  newsletterWelcomeEmail,
  contactConfirmationEmail,
  notifyMeConfirmationEmail,
  accountWelcomeEmail,
  stockNotificationEmail,
} from "@/lib/email-templates";

/**
 * Email template preview route.
 * Usage: /api/email-preview?template=newsletter
 * Available: newsletter, contact, notify-me, account-welcome, stock-notification
 *
 * DEV ONLY — remove before production or gate behind auth.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get("template") ?? "newsletter";

  let result: { subject: string; html: string; text: string };

  switch (template) {
    case "newsletter":
      result = newsletterWelcomeEmail();
      break;
    case "contact":
      result = contactConfirmationEmail("Bart");
      break;
    case "notify-me":
      result = notifyMeConfirmationEmail("Amarone della Valpolicella DOCG 2018");
      break;
    case "account-welcome":
      result = accountWelcomeEmail("Bart");
      break;
    case "stock-notification":
      result = stockNotificationEmail(
        "Barolo Classico DOCG 2018",
        "barolo-classico-2018"
      );
      break;
    default:
      return NextResponse.json(
        {
          error: "Unknown template",
          available: [
            "newsletter",
            "contact",
            "notify-me",
            "account-welcome",
            "stock-notification",
          ],
        },
        { status: 400 }
      );
  }

  // Return the HTML directly so it renders in the browser
  return new NextResponse(result.html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
