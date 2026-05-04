import "dotenv/config";
import {
  abandonedCartEmail,
  accountWelcomeEmail,
  contactConfirmationEmail,
  newsletterWelcomeEmail,
  notifyMeConfirmationEmail,
  stockNotificationEmail,
} from "../src/lib/email-templates";
import { isMailgunConfigured, sendMail } from "../src/lib/mailgun";

const recipients = (process.env.EMAIL_TEST_RECIPIENTS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

import { getProducts } from "../src/lib/shopify";
import { getSiteSettings } from "../src/lib/shopify-cms";
import { formatPrice } from "../src/lib/utils";

async function getTemplates() {
  const [products, settings] = await Promise.all([getProducts(3), getSiteSettings()]);
  const p0 = products[0];
  const p1 = products[1] ?? p0;
  const ownerName = settings?.ownerName || "Carla";
  const siteUrl = settings?.siteUrl || "https://vinoperlei.nl";

  return [
    { key: "newsletter", build: () => newsletterWelcomeEmail() },
    { key: "contact", build: () => contactConfirmationEmail(ownerName) },
    {
      key: "notify-me",
      build: () =>
        notifyMeConfirmationEmail(
          p0?.title ?? "Wijn",
          p0?.images?.[0]?.url ?? "",
          p0?.handle ?? ""
        ),
    },
    { key: "account-welcome", build: () => accountWelcomeEmail(ownerName) },
    {
      key: "stock-notification",
      build: () =>
        stockNotificationEmail(
          p1?.title ?? "Wijn",
          p1?.handle ?? "",
          p1?.images?.[0]?.url ?? "",
          p1 ? formatPrice(p1.price) : "€ 0,00"
        ),
    },
    {
      key: "abandoned-cart",
      build: () =>
        abandonedCartEmail({
          firstName: ownerName,
          checkoutUrl: siteUrl + "/wijnen",
          productTitle: p1?.title ?? "Wijn",
          productImageUrl: p1?.images?.[0]?.url ?? "",
        }),
    },
  ];
}

async function main() {
  if (recipients.length === 0) {
    console.error("Set EMAIL_TEST_RECIPIENTS to a comma-separated Gmail/Outlook test list.");
    process.exit(1);
  }

  if (!isMailgunConfigured()) {
    console.error("Mailgun is not configured. Set MAILGUN_API_KEY and MAILGUN_DOMAIN.");
    process.exit(1);
  }

  const templates = await getTemplates();
  for (const recipient of recipients) {
    for (const template of templates) {
      const email = await template.build();
      const ok = await sendMail({
        to: recipient,
        subject: `[TEST ${template.key}] ${email.subject}`,
        text: email.text,
        html: email.html,
      });

      console.log(`${ok ? "sent" : "failed"} ${template.key} -> ${recipient}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
