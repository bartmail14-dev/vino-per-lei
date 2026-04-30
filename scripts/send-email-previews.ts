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

const templates = [
  { key: "newsletter", build: () => newsletterWelcomeEmail() },
  { key: "contact", build: () => contactConfirmationEmail("Carla") },
  {
    key: "notify-me",
    build: () =>
      notifyMeConfirmationEmail(
        "Amarone della Valpolicella DOCG 2018",
        "https://vino-per-lei.vercel.app/images/products/amarone-della-valpolicella-2018.png",
        "amarone-della-valpolicella-2018"
      ),
  },
  { key: "account-welcome", build: () => accountWelcomeEmail("Carla") },
  {
    key: "stock-notification",
    build: () =>
      stockNotificationEmail(
        "Montaribaldi Barolo DOCG 2019",
        "montaribaldi-barolo-2019",
        "https://vino-per-lei.vercel.app/images/products/montaribaldi-barolo-2019.png",
        "€ 42,00"
      ),
  },
  {
    key: "abandoned-cart",
    build: () =>
      abandonedCartEmail({
        firstName: "Carla",
        checkoutUrl: "https://vinoperlei.nl/wijnen",
        productTitle: "Montaribaldi Barolo DOCG 2019",
        productImageUrl:
          "https://vino-per-lei.vercel.app/images/products/montaribaldi-barolo-2019.png",
      }),
  },
] as const;

async function main() {
  if (recipients.length === 0) {
    console.error("Set EMAIL_TEST_RECIPIENTS to a comma-separated Gmail/Outlook test list.");
    process.exit(1);
  }

  if (!isMailgunConfigured()) {
    console.error("Mailgun is not configured. Set MAILGUN_API_KEY and MAILGUN_DOMAIN.");
    process.exit(1);
  }

  for (const recipient of recipients) {
    for (const template of templates) {
      const email = template.build();
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
