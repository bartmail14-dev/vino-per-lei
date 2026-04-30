/**
 * Premium HTML email templates for Vino per Lei.
 * Design matches the website: navy blue (#1a1f3d), gold (#c9a227), cream (#faf9f7).
 * All emails use inline styles for maximum email client compatibility.
 */

const BRAND = {
  navy: "#1a1f3d",
  navyLight: "#2d3454",
  gold: "#c9a227",
  goldLight: "#d4b84a",
  champagne: "#f5e6c8",
  cream: "#faf9f7",
  warmWhite: "#f5f0e8",
  sand: "#e8e0d5",
  charcoal: "#1a1a1a",
  grey: "#6b6b6b",
  greyLight: "#a3a3a3",
  logoUrl: "https://vino-per-lei.vercel.app/logo.png",
  siteUrl: "https://vinoperlei.nl",
  siteName: "Vino per Lei",
  instagram: "https://instagram.com/vinoperlei",
};

export const SHOPIFY_NOTIFICATION_SUBJECTS_NL = {
  orderConfirmation: "Bestelling bevestigd - {{ name }}",
  orderEdited: "Je bestelling is bijgewerkt - {{ name }}",
  orderCancelled: "Je bestelling is geannuleerd - {{ name }}",
  refundCreated: "Terugbetaling verwerkt - {{ name }}",
  draftOrderInvoice: "Factuur voor je bestelling bij Vino per Lei",
  shippingConfirmation: "Je bestelling is onderweg - {{ fulfillment.tracking_company }}",
  shippingUpdate: "Update over je verzending - {{ name }}",
  outForDelivery: "Je bestelling wordt vandaag bezorgd - {{ name }}",
  delivered: "Je bestelling is bezorgd - {{ name }}",
  customerAccountInvite: "Activeer je account bij Vino per Lei",
  customerAccountWelcome: "Welkom bij Vino per Lei",
  customerPasswordReset: "Stel je wachtwoord opnieuw in",
  abandonedCheckout: "Je winkelmand wacht nog op je",
  posExchangeReceipt: "Je ruilbewijs van Vino per Lei",
  giftCardCreated: "Je cadeaubon van Vino per Lei",
} as const;

export const EMAIL_LIVEGANG_TEST_SCENARIOS = [
  "newsletter",
  "contact",
  "notify-me",
  "account-welcome",
  "stock-notification",
  "abandoned-cart",
] as const;

// Thin gold line separator
function goldLine(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0;">
    <tr>
      <td style="height:1px;background:linear-gradient(90deg, ${BRAND.sand}, ${BRAND.gold}40, ${BRAND.sand});"></td>
    </tr>
  </table>`;
}

// Clean header matching website navbar style
function headerBlock(): string {
  return `<!-- Header -->
  <tr>
    <td style="background-color:${BRAND.navy};padding:32px 40px;text-align:center;">
      <a href="${BRAND.siteUrl}" style="display:inline-block;text-decoration:none;">
        <img src="${BRAND.logoUrl}" alt="${BRAND.siteName}" width="120" height="120" style="display:block;width:120px;height:120px;margin:0 auto;">
      </a>
    </td>
  </tr>`;
}

// Footer matching website footer
function footerBlock(): string {
  return `<!-- Footer -->
  <tr>
    <td style="background-color:${BRAND.navy};padding:32px 40px;text-align:center;">
      <img src="${BRAND.logoUrl}" alt="${BRAND.siteName}" width="48" height="48" style="display:block;width:48px;height:48px;margin:0 auto 14px;">
      <p style="margin:0 0 12px;color:rgba(255,255,255,0.9);font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;">
        Italiaanse wijnen, rechtstreeks van de producent
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
        <tr>
          <td style="padding:0 10px;">
            <a href="${BRAND.siteUrl}" style="color:${BRAND.gold};font-size:13px;text-decoration:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">vinoperlei.nl</a>
          </td>
          <td style="color:rgba(255,255,255,0.3);font-size:13px;">|</td>
          <td style="padding:0 10px;">
            <a href="${BRAND.instagram}" style="color:${BRAND.gold};font-size:13px;text-decoration:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Instagram</a>
          </td>
        </tr>
      </table>
      <p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
        &copy; ${new Date().getFullYear()} ${BRAND.siteName} &mdash; Alle rechten voorbehouden
      </p>
    </td>
  </tr>`;
}

function emailWrapper(content: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND.siteName}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BRAND.warmWhite};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  ${preheader ? `<div style="display:none;font-size:1px;color:${BRAND.warmWhite};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>` : ""}
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:${BRAND.warmWhite};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 12px rgba(26,31,61,0.06);">
          ${headerBlock()}
          <!-- Content -->
          <tr>
            <td style="padding:36px 40px;">
              ${content}
            </td>
          </tr>
          ${footerBlock()}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
    <tr>
      <td style="background-color:${BRAND.gold};border-radius:8px;">
        <a href="${url}" style="display:inline-block;padding:14px 32px;color:${BRAND.navy};font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;text-transform:uppercase;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

function buttonOutline(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0;">
    <tr>
      <td style="border:2px solid ${BRAND.navy};border-radius:8px;">
        <a href="${url}" style="display:inline-block;padding:12px 28px;color:${BRAND.navy};font-size:13px;font-weight:600;text-decoration:none;letter-spacing:0.5px;text-transform:uppercase;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;color:${BRAND.navy};font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400;line-height:1.3;">${text}</h1>`;
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 14px;color:${BRAND.charcoal};font-size:15px;line-height:1.7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${text}</p>`;
}

function signature(): string {
  return `${goldLine()}
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td>
        <p style="margin:0 0 2px;color:${BRAND.grey};font-size:13px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Met warme groet,</p>
        <p style="margin:0 0 2px;color:${BRAND.navy};font-family:Georgia,'Times New Roman',serif;font-size:17px;font-style:italic;">Carla Daniels</p>
        <p style="margin:0;color:${BRAND.gold};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Vino per Lei</p>
      </td>
    </tr>
  </table>`;
}

// Product card with image — matches website product card style
function productCard(opts: {
  title: string;
  imageUrl?: string;
  price?: string;
  url: string;
  label?: string;
}): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:20px 0;border:1px solid ${BRAND.sand};border-radius:10px;overflow:hidden;">
    <tr>
      ${opts.imageUrl ? `
      <td style="width:140px;vertical-align:top;background-color:${BRAND.cream};">
        <a href="${opts.url}" style="display:block;">
          <img src="${opts.imageUrl}" alt="${opts.title}" width="140" style="display:block;width:140px;height:auto;max-height:180px;object-fit:contain;padding:12px;" />
        </a>
      </td>` : ""}
      <td style="vertical-align:middle;padding:20px 24px;">
        ${opts.label ? `<p style="margin:0 0 6px;color:${BRAND.gold};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${opts.label}</p>` : ""}
        <p style="margin:0 0 8px;color:${BRAND.navy};font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.3;">
          <a href="${opts.url}" style="color:${BRAND.navy};text-decoration:none;">${opts.title}</a>
        </p>
        ${opts.price ? `<p style="margin:0;color:${BRAND.charcoal};font-size:15px;font-weight:600;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${opts.price}</p>` : ""}
      </td>
    </tr>
  </table>`;
}

// Info box with cream background — matches website card style
function infoBox(content: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:20px 0;">
    <tr>
      <td style="background-color:${BRAND.cream};border-radius:8px;padding:20px 24px;">
        ${content}
      </td>
    </tr>
  </table>`;
}

// --- Templates ---

export function newsletterWelcomeEmail(): { subject: string; html: string; text: string } {
  const html = emailWrapper(
    `${heading("Welkom bij Vino per Lei")}
     ${paragraph("Wat fijn dat je erbij bent! Vanaf nu ben je als eerste op de hoogte van nieuwe wijnen, seizoensaanbiedingen en exclusieve proeverijen.")}
     ${infoBox(`
       <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
         <tr><td style="padding:3px 0;color:${BRAND.charcoal};font-size:14px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;"><span style="color:${BRAND.gold};margin-right:8px;">&#10003;</span> Maximaal twee keer per maand</td></tr>
         <tr><td style="padding:3px 0;color:${BRAND.charcoal};font-size:14px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;"><span style="color:${BRAND.gold};margin-right:8px;">&#10003;</span> Handgeselecteerde wijnen uit Itali&euml;</td></tr>
         <tr><td style="padding:3px 0;color:${BRAND.charcoal};font-size:14px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;"><span style="color:${BRAND.gold};margin-right:8px;">&#10003;</span> Geen spam, alleen de mooiste ontdekkingen</td></tr>
       </table>
     `)}
     ${paragraph("Benieuwd wat we in huis hebben? Ontdek onze collectie en vind jouw perfecte wijn.")}
     ${button("Bekijk collectie", `${BRAND.siteUrl}/wijnen`)}
     ${signature()}`,
    "Welkom bij de Vino per Lei nieuwsbrief — ontdek Italiaanse wijnen"
  );

  const text = `Welkom bij Vino per Lei!

Wat fijn dat je erbij bent! Vanaf nu ben je als eerste op de hoogte van nieuwe wijnen, seizoensaanbiedingen en exclusieve proeverijen.

- Maximaal twee keer per maand
- Handgeselecteerde wijnen uit Italië
- Geen spam, alleen de mooiste ontdekkingen

Bekijk collectie: ${BRAND.siteUrl}/wijnen

Met warme groet,
Carla Daniels
Vino per Lei`;

  return { subject: "Welkom bij de Vino per Lei nieuwsbrief", html, text };
}

export function contactConfirmationEmail(naam: string): { subject: string; html: string; text: string } {
  const html = emailWrapper(
    `${heading(`Bedankt voor je bericht, ${naam}`)}
     ${paragraph("We hebben je bericht in goede orde ontvangen en nemen zo snel mogelijk contact met je op — meestal binnen 1&ndash;2 werkdagen.")}
     ${infoBox(`
       <p style="margin:0;color:${BRAND.charcoal};font-size:14px;line-height:1.6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
         Dringende vraag? Neem direct contact op via<br>
         <a href="mailto:info@vinoperlei.nl" style="color:${BRAND.gold};font-weight:600;text-decoration:none;">info@vinoperlei.nl</a>
       </p>
     `)}
     ${paragraph("In de tussentijd nodigen we je uit om onze collectie te ontdekken.")}
     ${button("Bekijk onze wijnen", `${BRAND.siteUrl}/wijnen`)}
     ${signature()}`,
    `Bedankt voor je bericht, ${naam} — we reageren zo snel mogelijk`
  );

  const text = `Bedankt voor je bericht, ${naam}!

We hebben je bericht in goede orde ontvangen. We nemen zo snel mogelijk contact met je op — meestal binnen 1-2 werkdagen.

Dringende vraag? Mail ons via info@vinoperlei.nl

Met warme groet,
Carla Daniels
Vino per Lei`;

  return { subject: "Bedankt voor je bericht — Vino per Lei", html, text };
}

export function notifyMeConfirmationEmail(
  productTitle: string,
  productImageUrl?: string,
  productHandle?: string
): {
  subject: string;
  html: string;
  text: string;
} {
  const productUrl = productHandle
    ? `${BRAND.siteUrl}/wijnen/${productHandle}`
    : `${BRAND.siteUrl}/wijnen`;

  const html = emailWrapper(
    `${heading("We houden je op de hoogte")}
     ${paragraph(`Je ontvangt een e-mail zodra deze wijn weer beschikbaar is.`)}
     ${productCard({
       title: productTitle,
       imageUrl: productImageUrl,
       url: productUrl,
       label: "Voorraadmelding actief",
     })}
     ${paragraph("In de tussentijd hebben we nog meer prachtige wijnen in onze collectie.")}
     ${buttonOutline("Ontdek meer wijnen", `${BRAND.siteUrl}/wijnen`)}
     ${signature()}`,
    `We laten je weten wanneer ${productTitle} weer beschikbaar is`
  );

  const text = `We houden je op de hoogte!

Je ontvangt een e-mail zodra "${productTitle}" weer beschikbaar is.

Ontdek meer wijnen: ${BRAND.siteUrl}/wijnen

Met warme groet,
Carla Daniels
Vino per Lei`;

  return { subject: `Voorraadmelding: ${productTitle} — Vino per Lei`, html, text };
}

export function accountWelcomeEmail(firstName: string): {
  subject: string;
  html: string;
  text: string;
} {
  const html = emailWrapper(
    `${heading(`Welkom, ${firstName}`)}
     ${paragraph("Je account bij Vino per Lei is aangemaakt. Vanaf nu wordt wijn kopen nog makkelijker.")}
     ${infoBox(`
       <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
         <tr><td style="padding:4px 0;color:${BRAND.charcoal};font-size:14px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;"><span style="color:${BRAND.gold};margin-right:8px;">&#10003;</span> Bestellingen bekijken en volgen</td></tr>
         <tr><td style="padding:4px 0;color:${BRAND.charcoal};font-size:14px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;"><span style="color:${BRAND.gold};margin-right:8px;">&#10003;</span> Adressen beheren voor sneller afrekenen</td></tr>
         <tr><td style="padding:4px 0;color:${BRAND.charcoal};font-size:14px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;"><span style="color:${BRAND.gold};margin-right:8px;">&#10003;</span> Verlanglijstje synchroniseren</td></tr>
       </table>
     `)}
     ${button("Ga naar mijn account", `${BRAND.siteUrl}/account`)}
     ${signature()}`,
    `Welkom bij Vino per Lei, ${firstName} — je account is klaar`
  );

  const text = `Welkom, ${firstName}!

Je account bij Vino per Lei is aangemaakt. Met je account kun je:
- Bestellingen bekijken en volgen
- Adressen beheren voor sneller afrekenen
- Verlanglijstje synchroniseren

Ga naar je account: ${BRAND.siteUrl}/account

Met warme groet,
Carla Daniels
Vino per Lei`;

  return { subject: `Welkom bij Vino per Lei, ${firstName}!`, html, text };
}

export function stockNotificationEmail(
  productTitle: string,
  productHandle: string,
  productImageUrl?: string,
  productPrice?: string
): { subject: string; html: string; text: string } {
  const productUrl = `${BRAND.siteUrl}/wijnen/${productHandle}`;

  const html = emailWrapper(
    `${heading("Goed nieuws!")}
     ${paragraph("De wijn waar je op wachtte is weer beschikbaar. Bestel snel — onze Italiaanse wijnen zijn vaak snel uitverkocht.")}
     ${productCard({
       title: productTitle,
       imageUrl: productImageUrl,
       price: productPrice,
       url: productUrl,
       label: "Weer op voorraad",
     })}
     ${button("Nu bestellen", productUrl)}
     ${paragraph(`Of <a href="${BRAND.siteUrl}/wijnen" style="color:${BRAND.gold};text-decoration:none;font-weight:600;">bekijk alle wijnen</a> in onze collectie.`)}
     ${signature()}`,
    `${productTitle} is weer op voorraad bij Vino per Lei — bestel nu`
  );

  const text = `Goed nieuws!

${productTitle} is weer op voorraad! Bestel snel, want de voorraad is beperkt.
${productPrice ? `Prijs: ${productPrice}` : ""}

Bekijk en bestel: ${productUrl}

Met warme groet,
Carla Daniels
Vino per Lei`;

  return { subject: `${productTitle} is weer op voorraad`, html, text };
}

export function abandonedCartEmail(opts: {
  firstName?: string;
  checkoutUrl: string;
  productTitle?: string;
  productImageUrl?: string;
}): { subject: string; html: string; text: string } {
  const greeting = opts.firstName ? `Hoi ${opts.firstName}` : "Hoi";
  const productTitle = opts.productTitle || "je selectie";

  const html = emailWrapper(
    `${heading(`${greeting}, je winkelmand staat nog klaar`)}
     ${paragraph("Je was bezig met een bestelling bij Vino per Lei. We bewaren je winkelmand nog even, zodat je later rustig kunt afronden.")}
     ${productCard({
       title: productTitle,
       imageUrl: opts.productImageUrl,
       url: opts.checkoutUrl,
       label: "Nog in je winkelmand",
     })}
     ${button("Rond je bestelling af", opts.checkoutUrl)}
     ${paragraph(`Twijfel je nog over een wijn? Mail Carla via <a href="mailto:info@vinoperlei.nl" style="color:${BRAND.gold};text-decoration:none;font-weight:600;">info@vinoperlei.nl</a>, dan denkt ze met je mee.`)}
     ${signature()}`,
    "Je winkelmand bij Vino per Lei staat nog klaar"
  );

  const text = `${greeting}, je winkelmand staat nog klaar.

Je was bezig met een bestelling bij Vino per Lei. We bewaren je winkelmand nog even, zodat je later rustig kunt afronden.

Rond je bestelling af: ${opts.checkoutUrl}

Twijfel je nog over een wijn? Mail Carla via info@vinoperlei.nl.

Met warme groet,
Carla Daniels
Vino per Lei`;

  return { subject: SHOPIFY_NOTIFICATION_SUBJECTS_NL.abandonedCheckout, html, text };
}
