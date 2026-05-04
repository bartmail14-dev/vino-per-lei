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
import { getProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";

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

  // Fetch real products from Shopify for preview data
  const products = await getProducts(3);
  const p0 = products[0];
  const p1 = products[1] ?? products[0];

  let result: { subject: string; html: string; text: string };

  switch (template) {
    case "newsletter":
      result = await newsletterWelcomeEmail();
      break;
    case "contact":
      result = await contactConfirmationEmail("Bart");
      break;
    case "notify-me":
      result = await notifyMeConfirmationEmail(
        p0.title,
        p0.images[0]?.url ?? "",
        p0.handle
      );
      break;
    case "account-welcome":
      result = await accountWelcomeEmail("Bart");
      break;
    case "stock-notification":
      result = await stockNotificationEmail(
        p1.title,
        p1.handle,
        p1.images[0]?.url ?? "",
        formatPrice(p1.price)
      );
      break;
    case "abandoned-cart":
      result = await abandonedCartEmail({
        firstName: "Carla",
        checkoutUrl: "https://vinoperlei.nl/wijnen",
        productTitle: p1.title,
        productImageUrl: p1.images[0]?.url ?? "",
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
