/**
 * HTML email templates for Vino per Lei.
 * All emails use inline styles for maximum email client compatibility.
 */

const BRAND = {
  wine: "#1a1f3d",
  gold: "#c9a227",
  cream: "#faf9f7",
  sand: "#e8e0d5",
  charcoal: "#2c2c2c",
  grey: "#6b7280",
  logoUrl: "https://vino-per-lei.vercel.app/logo.png",
  siteUrl: "https://vinoperlei.nl",
  siteName: "Vino per Lei",
};

function emailWrapper(content: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND.siteName}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BRAND.cream};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  ${preheader ? `<div style="display:none;font-size:1px;color:${BRAND.cream};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>` : ""}
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:${BRAND.cream};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.wine};padding:32px 40px;text-align:center;">
              <img src="${BRAND.logoUrl}" alt="${BRAND.siteName}" width="48" height="48" style="display:inline-block;width:48px;height:48px;border-radius:8px;">
              <p style="margin:12px 0 0;color:${BRAND.gold};font-size:20px;font-weight:600;letter-spacing:0.5px;">${BRAND.siteName}</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid ${BRAND.sand};text-align:center;">
              <p style="margin:0 0 8px;color:${BRAND.grey};font-size:12px;">
                ${BRAND.siteName} — Italiaanse wijnen rechtstreeks van de producent
              </p>
              <p style="margin:0;color:${BRAND.grey};font-size:12px;">
                <a href="${BRAND.siteUrl}" style="color:${BRAND.gold};text-decoration:none;">vinoperlei.nl</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
    <tr>
      <td style="background-color:${BRAND.wine};border-radius:8px;">
        <a href="${url}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.5px;text-transform:uppercase;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

// --- Templates ---

export function newsletterWelcomeEmail(): { subject: string; html: string; text: string } {
  const html = emailWrapper(
    `<h1 style="margin:0 0 16px;color:${BRAND.wine};font-size:24px;font-weight:700;">
        Welkom bij Vino per Lei!
      </h1>
      <p style="margin:0 0 16px;color:${BRAND.charcoal};font-size:15px;line-height:1.6;">
        Bedankt voor je aanmelding voor onze nieuwsbrief. Je bent nu als eerste op de hoogte van nieuwe wijnen,
        seizoensaanbiedingen en exclusieve proeverijen.
      </p>
      <p style="margin:0 0 16px;color:${BRAND.charcoal};font-size:15px;line-height:1.6;">
        We versturen maximaal twee keer per maand een nieuwsbrief — geen spam, alleen de mooiste Italiaanse wijnen.
      </p>
      ${button("Bekijk onze collectie", `${BRAND.siteUrl}/wijnen`)}
      <p style="margin:24px 0 0;color:${BRAND.grey};font-size:13px;line-height:1.5;">
        Hartelijke groet,<br>Carla Daniels<br><em>Vino per Lei</em>
      </p>`,
    "Welkom bij de Vino per Lei nieuwsbrief — ontdek Italiaanse wijnen"
  );

  const text = `Welkom bij Vino per Lei!

Bedankt voor je aanmelding voor onze nieuwsbrief. Je bent nu als eerste op de hoogte van nieuwe wijnen, seizoensaanbiedingen en exclusieve proeverijen.

We versturen maximaal twee keer per maand een nieuwsbrief — geen spam, alleen de mooiste Italiaanse wijnen.

Bekijk onze collectie: ${BRAND.siteUrl}/wijnen

Hartelijke groet,
Carla Daniels
Vino per Lei`;

  return { subject: "Welkom bij de Vino per Lei nieuwsbrief 🍷", html, text };
}

export function contactConfirmationEmail(naam: string): { subject: string; html: string; text: string } {
  const html = emailWrapper(
    `<h1 style="margin:0 0 16px;color:${BRAND.wine};font-size:24px;font-weight:700;">
        Bedankt voor je bericht, ${naam}!
      </h1>
      <p style="margin:0 0 16px;color:${BRAND.charcoal};font-size:15px;line-height:1.6;">
        We hebben je bericht ontvangen en proberen zo snel mogelijk te reageren —
        meestal binnen 1-2 werkdagen.
      </p>
      <p style="margin:0 0 16px;color:${BRAND.charcoal};font-size:15px;line-height:1.6;">
        Heb je een dringende vraag? Neem dan contact op via
        <a href="mailto:info@vinoperlei.nl" style="color:${BRAND.gold};">info@vinoperlei.nl</a>.
      </p>
      <p style="margin:24px 0 0;color:${BRAND.grey};font-size:13px;line-height:1.5;">
        Hartelijke groet,<br>Carla Daniels<br><em>Vino per Lei</em>
      </p>`,
    `Bedankt voor je bericht, ${naam} — we reageren zo snel mogelijk`
  );

  const text = `Bedankt voor je bericht, ${naam}!

We hebben je bericht ontvangen en proberen zo snel mogelijk te reageren — meestal binnen 1-2 werkdagen.

Heb je een dringende vraag? Neem dan contact op via info@vinoperlei.nl.

Hartelijke groet,
Carla Daniels
Vino per Lei`;

  return { subject: "Bedankt voor je bericht — Vino per Lei", html, text };
}

export function notifyMeConfirmationEmail(productTitle: string): {
  subject: string;
  html: string;
  text: string;
} {
  const html = emailWrapper(
    `<h1 style="margin:0 0 16px;color:${BRAND.wine};font-size:24px;font-weight:700;">
        Voorraadmelding ingesteld
      </h1>
      <p style="margin:0 0 16px;color:${BRAND.charcoal};font-size:15px;line-height:1.6;">
        Je ontvangt een e-mail zodra <strong>${productTitle}</strong> weer op voorraad is.
      </p>
      <p style="margin:0 0 16px;color:${BRAND.charcoal};font-size:15px;line-height:1.6;">
        In de tussentijd kun je onze andere wijnen bekijken — misschien vind je een nieuwe favoriet!
      </p>
      ${button("Ontdek meer wijnen", `${BRAND.siteUrl}/wijnen`)}
      <p style="margin:24px 0 0;color:${BRAND.grey};font-size:13px;line-height:1.5;">
        Hartelijke groet,<br>Carla Daniels<br><em>Vino per Lei</em>
      </p>`,
    `We laten je weten wanneer ${productTitle} weer beschikbaar is`
  );

  const text = `Voorraadmelding ingesteld

Je ontvangt een e-mail zodra "${productTitle}" weer op voorraad is.

In de tussentijd kun je onze andere wijnen bekijken: ${BRAND.siteUrl}/wijnen

Hartelijke groet,
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
    `<h1 style="margin:0 0 16px;color:${BRAND.wine};font-size:24px;font-weight:700;">
        Welkom, ${firstName}!
      </h1>
      <p style="margin:0 0 16px;color:${BRAND.charcoal};font-size:15px;line-height:1.6;">
        Je account bij Vino per Lei is aangemaakt. Met je account kun je:
      </p>
      <ul style="margin:0 0 16px;padding-left:20px;color:${BRAND.charcoal};font-size:15px;line-height:1.8;">
        <li>Je bestellingen bekijken en volgen</li>
        <li>Je adressen beheren voor sneller afrekenen</li>
        <li>Je verlanglijstje synchroniseren</li>
      </ul>
      ${button("Ga naar mijn account", `${BRAND.siteUrl}/account`)}
      <p style="margin:24px 0 0;color:${BRAND.grey};font-size:13px;line-height:1.5;">
        Hartelijke groet,<br>Carla Daniels<br><em>Vino per Lei</em>
      </p>`,
    `Welkom bij Vino per Lei, ${firstName} — je account is klaar`
  );

  const text = `Welkom, ${firstName}!

Je account bij Vino per Lei is aangemaakt. Met je account kun je:
- Je bestellingen bekijken en volgen
- Je adressen beheren voor sneller afrekenen
- Je verlanglijstje synchroniseren

Ga naar je account: ${BRAND.siteUrl}/account

Hartelijke groet,
Carla Daniels
Vino per Lei`;

  return { subject: `Welkom bij Vino per Lei, ${firstName}!`, html, text };
}

export function stockNotificationEmail(
  productTitle: string,
  productHandle: string
): { subject: string; html: string; text: string } {
  const productUrl = `${BRAND.siteUrl}/wijnen/${productHandle}`;

  const html = emailWrapper(
    `<h1 style="margin:0 0 16px;color:${BRAND.wine};font-size:24px;font-weight:700;">
        Goed nieuws!
      </h1>
      <p style="margin:0 0 16px;color:${BRAND.charcoal};font-size:15px;line-height:1.6;">
        <strong>${productTitle}</strong> is weer op voorraad! Bestel snel, want de voorraad is beperkt.
      </p>
      ${button("Nu bestellen", productUrl)}
      <p style="margin:24px 0 0;color:${BRAND.grey};font-size:13px;line-height:1.5;">
        Hartelijke groet,<br>Carla Daniels<br><em>Vino per Lei</em>
      </p>`,
    `${productTitle} is weer op voorraad bij Vino per Lei`
  );

  const text = `Goed nieuws!

${productTitle} is weer op voorraad! Bestel snel, want de voorraad is beperkt.

Bekijk en bestel: ${productUrl}

Hartelijke groet,
Carla Daniels
Vino per Lei`;

  return { subject: `${productTitle} is weer op voorraad!`, html, text };
}
