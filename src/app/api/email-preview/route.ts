import { NextResponse } from "next/server";
import {
  newsletterWelcomeEmail,
  contactConfirmationEmail,
  notifyMeConfirmationEmail,
  accountWelcomeEmail,
  stockNotificationEmail,
  abandonedCartEmail,
  EMAIL_LIVEGANG_TEST_SCENARIOS,
  SHOPIFY_NOTIFICATION_SUBJECTS_NL,
} from "@/lib/email-templates";

/**
 * Email template preview route.
 * Usage: /api/email-preview?template=newsletter&key=SECRET
 * Available: newsletter, contact, notify-me, account-welcome, stock-notification, abandoned-cart
 *
 * Protected with a secret key to prevent public access.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Gate behind a secret key
  const key = searchParams.get("key");
  const secret = process.env.EMAIL_PREVIEW_SECRET;
  if (!secret || key !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const template = searchParams.get("template") ?? "newsletter";

  if (template === "subjects") {
    return NextResponse.json({
      shopify: SHOPIFY_NOTIFICATION_SUBJECTS_NL,
      siteTemplates: EMAIL_LIVEGANG_TEST_SCENARIOS,
    });
  }

  let result: { subject: string; html: string; text: string };

  switch (template) {
    case "newsletter":
      result = newsletterWelcomeEmail();
      break;
    case "contact":
      result = contactConfirmationEmail("Bart");
      break;
    case "notify-me":
      result = notifyMeConfirmationEmail(
        "Amarone della Valpolicella DOCG 2018",
        "https://cdn.shopify.com/s/files/1/0958/7150/0615/files/amarone-valpolicella.png?v=1772204755&width=400&height=600&crop=center",
        "amarone-della-valpolicella-2018"
      );
      break;
    case "account-welcome":
      result = accountWelcomeEmail("Bart");
      break;
    case "stock-notification":
      result = stockNotificationEmail(
        "Montaribaldi Barolo DOCG 2019",
        "montaribaldi-barolo-2019",
        "https://cdn.shopify.com/s/files/1/0958/7150/0615/files/montaribaldi-barolo.png?v=1772204755&width=400&height=600&crop=center",
        "€ 42,00"
      );
      break;
    case "abandoned-cart":
      result = abandonedCartEmail({
        firstName: "Carla",
        checkoutUrl: "https://vinoperlei.nl/wijnen",
        productTitle: "Montaribaldi Barolo DOCG 2019",
        productImageUrl:
          "https://cdn.shopify.com/s/files/1/0958/7150/0615/files/montaribaldi-barolo.png?v=1772204755&width=400&height=600&crop=center",
      });
      break;
    default:
      return NextResponse.json(
        {
          error: "Unknown template",
          available: [...EMAIL_LIVEGANG_TEST_SCENARIOS, "subjects"],
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
