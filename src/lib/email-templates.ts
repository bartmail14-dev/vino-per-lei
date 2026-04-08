/**
 * Premium HTML email templates for Vino per Lei.
 * All emails use inline styles for maximum email client compatibility.
 * Design: Italian wine luxury — serif headings, warm gradients, gold accents.
 */

const BRAND = {
  wine: "#1a1f3d",
  wineLight: "#2d3561",
  burgundy: "#722f37",
  gold: "#c9a227",
  goldLight: "#d4b44a",
  cream: "#faf9f7",
  sand: "#e8e0d5",
  warmWhite: "#fdfcfa",
  charcoal: "#2c2c2c",
  grey: "#6b7280",
  greyLight: "#9ca3af",
  logoUrl: "https://vino-per-lei.vercel.app/logo.png",
  siteUrl: "https://vinoperlei.nl",
  siteName: "Vino per Lei",
  instagram: "https://instagram.com/vinoperlei",
};

// Decorative wine-themed divider
function divider(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
    <tr>
      <td style="border-bottom:1px solid ${BRAND.sand};line-height:0;">&nbsp;</td>
      <td style="width:60px;text-align:center;line-height:0;padding:0 12px;">
        <span style="font-size:18px;color:${BRAND.gold};">&#9830;</span>
      </td>
      <td style="border-bottom:1px solid ${BRAND.sand};line-height:0;">&nbsp;</td>
    </tr>
  </table>`;
}

// Premium gradient header with logo
function headerBlock(subtitle?: string): string {
  return `<!-- Header with gradient -->
  <tr>
    <td style="background:linear-gradient(135deg, ${BRAND.wine} 0%, ${BRAND.burgundy} 50%, ${BRAND.wine} 100%);padding:0;">
      <!-- Gold top accent line -->
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="height:3px;background:linear-gradient(90deg, transparent, ${BRAND.gold}, transparent);"></td></tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:36px 40px 32px;">
        <tr>
          <td align="center">
            <img src="${BRAND.logoUrl}" alt="${BRAND.siteName}" width="56" height="56" style="display:block;width:56px;height:56px;border-radius:10px;border:2px solid rgba(201,162,39,0.3);margin:0 auto;">
            <h1 style="margin:14px 0 0;color:#ffffff;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400;letter-spacing:1.5px;">
              Vino <span style="color:${BRAND.gold};">per</span> Lei
            </h1>
            ${subtitle ? `<p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;">${subtitle}</p>` : ""}
          </td>
        </tr>
      </table>
      <!-- Gold bottom accent line -->
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="height:2px;background:linear-gradient(90deg, transparent, ${BRAND.gold}40, transparent);"></td></tr>
      </table>
    </td>
  </tr>`;
}

// Premium footer with social + branding
function footerBlock(): string {
  return `<!-- Footer -->
  <tr>
    <td style="padding:0;">
      <!-- Gold accent line -->
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="height:1px;background:linear-gradient(90deg, transparent, ${BRAND.sand}, transparent);"></td></tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:28px 40px 20px;">
        <tr>
          <td align="center">
            <!-- Tagline -->
            <p style="margin:0 0 16px;color:${BRAND.charcoal};font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;">
              Italiaanse wijnen, rechtstreeks van de producent
            </p>
            <!-- Social -->
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
              <tr>
                <td style="padding:0 8px;">
                  <a href="${BRAND.siteUrl}" style="color:${BRAND.gold};font-size:12px;text-decoration:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">vinoperlei.nl</a>
                </td>
                <td style="color:${BRAND.sand};font-size:12px;">|</td>
                <td style="padding:0 8px;">
                  <a href="${BRAND.instagram}" style="color:${BRAND.gold};font-size:12px;text-decoration:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Instagram</a>
                </td>
              </tr>
            </table>
            <!-- Copyright -->
            <p style="margin:0;color:${BRAND.greyLight};font-size:11px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
              &copy; ${new Date().getFullYear()} ${BRAND.siteName} &mdash; Alle rechten voorbehouden
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function emailWrapper(content: string, preheader?: string, headerSubtitle?: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND.siteName}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f0ebe4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  ${preheader ? `<div style="display:none;font-size:1px;color:#f0ebe4;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>` : ""}
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0ebe4;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background-color:${BRAND.warmWhite};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(26,31,61,0.08);">
          ${headerBlock(headerSubtitle)}
          <!-- Content -->
          <tr>
            <td style="padding:40px 44px;">
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
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;">
    <tr>
      <td style="background:linear-gradient(135deg, ${BRAND.wine} 0%, ${BRAND.burgundy} 100%);border-radius:10px;box-shadow:0 2px 8px rgba(26,31,61,0.15);">
        <a href="${url}" style="display:inline-block;padding:15px 36px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:1px;text-transform:uppercase;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

// Greeting block with serif heading
function heading(text: string): string {
  return `<h1 style="margin:0 0 20px;color:${BRAND.wine};font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;line-height:1.3;">${text}</h1>`;
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;color:${BRAND.charcoal};font-size:15px;line-height:1.7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${text}</p>`;
}

function signature(): string {
  return `${divider()}
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="padding:0;">
        <p style="margin:0 0 2px;color:${BRAND.charcoal};font-size:14px;line-height:1.5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          Met warme groet,
        </p>
        <p style="margin:0 0 2px;color:${BRAND.wine};font-family:Georgia,'Times New Roman',serif;font-size:18px;font-style:italic;">
          Carla Daniels
        </p>
        <p style="margin:0;color:${BRAND.gold};font-size:12px;letter-spacing:1px;text-transform:uppercase;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          Vino per Lei
        </p>
      </td>
    </tr>
  </table>`;
}

// Highlight box for key info
function highlightBox(content: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:20px 0;">
    <tr>
      <td style="background-color:${BRAND.cream};border-left:3px solid ${BRAND.gold};border-radius:0 8px 8px 0;padding:20px 24px;">
        ${content}
      </td>
    </tr>
  </table>`;
}

// --- Templates ---

export function newsletterWelcomeEmail(): { subject: string; html: string; text: string } {
  const html = emailWrapper(
    `${heading("Welkom bij onze wereld van Italiaanse wijnen")}
     ${paragraph("Wat fijn dat je erbij bent! Vanaf nu ben je als eerste op de hoogte van nieuwe wijnen, seizoensaanbiedingen en exclusieve proeverijen.")}
     ${highlightBox(`
       <p style="margin:0;color:${BRAND.charcoal};font-size:14px;line-height:1.6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
         <span style="color:${BRAND.gold};font-size:16px;">&#10026;</span>&ensp;Maximaal twee keer per maand<br>
         <span style="color:${BRAND.gold};font-size:16px;">&#10026;</span>&ensp;Handgeselecteerde wijnen uit Itali&euml;<br>
         <span style="color:${BRAND.gold};font-size:16px;">&#10026;</span>&ensp;Geen spam, alleen de mooiste ontdekkingen
       </p>
     `)}
     ${paragraph("Benieuwd wat we in huis hebben? Ontdek onze collectie en vind jouw perfecte wijn.")}
     ${button("Ontdek de collectie", `${BRAND.siteUrl}/wijnen`)}
     ${signature()}`,
    "Welkom bij de Vino per Lei nieuwsbrief — ontdek Italiaanse wijnen",
    "Nieuwsbrief"
  );

  const text = `Welkom bij onze wereld van Italiaanse wijnen!

Wat fijn dat je erbij bent! Vanaf nu ben je als eerste op de hoogte van nieuwe wijnen, seizoensaanbiedingen en exclusieve proeverijen.

- Maximaal twee keer per maand
- Handgeselecteerde wijnen uit Italië
- Geen spam, alleen de mooiste ontdekkingen

Ontdek de collectie: ${BRAND.siteUrl}/wijnen

Met warme groet,
Carla Daniels
Vino per Lei`;

  return { subject: "Welkom bij de Vino per Lei nieuwsbrief 🍷", html, text };
}

export function contactConfirmationEmail(naam: string): { subject: string; html: string; text: string } {
  const html = emailWrapper(
    `${heading(`Bedankt voor je bericht, ${naam}`)}
     ${paragraph("We hebben je bericht in goede orde ontvangen. We nemen zo snel mogelijk contact met je op — meestal binnen 1&ndash;2 werkdagen.")}
     ${highlightBox(`
       <p style="margin:0;color:${BRAND.charcoal};font-size:14px;line-height:1.6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
         Dringende vraag? Je kunt ons ook direct bereiken via<br>
         <a href="mailto:info@vinoperlei.nl" style="color:${BRAND.gold};font-weight:600;text-decoration:none;">info@vinoperlei.nl</a>
       </p>
     `)}
     ${paragraph("In de tussentijd nodigen we je uit om onze collectie te ontdekken — wie weet vind je een verrassende favoriet.")}
     ${button("Bekijk onze wijnen", `${BRAND.siteUrl}/wijnen`)}
     ${signature()}`,
    `Bedankt voor je bericht, ${naam} — we reageren zo snel mogelijk`,
    "Contact"
  );

  const text = `Bedankt voor je bericht, ${naam}!

We hebben je bericht in goede orde ontvangen. We nemen zo snel mogelijk contact met je op — meestal binnen 1-2 werkdagen.

Dringende vraag? Mail ons via info@vinoperlei.nl

Met warme groet,
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
    `${heading("We houden je op de hoogte")}
     ${paragraph(`Je ontvangt een e-mail zodra <strong style="color:${BRAND.wine};">${productTitle}</strong> weer beschikbaar is. We doen ons best om dit zo snel mogelijk te regelen.`)}
     ${highlightBox(`
       <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
         <tr>
           <td style="padding:0;">
             <p style="margin:0 0 4px;color:${BRAND.grey};font-size:12px;text-transform:uppercase;letter-spacing:1px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Voorraadmelding voor</p>
             <p style="margin:0;color:${BRAND.wine};font-family:Georgia,'Times New Roman',serif;font-size:18px;">${productTitle}</p>
           </td>
         </tr>
       </table>
     `)}
     ${paragraph("In de tussentijd hebben we nog meer prachtige wijnen in onze collectie. Misschien zit jouw nieuwe favoriet ertussen!")}
     ${button("Ontdek meer wijnen", `${BRAND.siteUrl}/wijnen`)}
     ${signature()}`,
    `We laten je weten wanneer ${productTitle} weer beschikbaar is`,
    "Voorraadmelding"
  );

  const text = `We houden je op de hoogte!

Je ontvangt een e-mail zodra "${productTitle}" weer beschikbaar is.

In de tussentijd kun je onze andere wijnen bekijken: ${BRAND.siteUrl}/wijnen

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
     ${paragraph("Je persoonlijke account bij Vino per Lei is klaar. Vanaf nu wordt wijn kopen nog makkelijker.")}
     ${highlightBox(`
       <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
         <tr>
           <td style="padding:0;">
             <p style="margin:0 0 12px;color:${BRAND.charcoal};font-size:14px;font-weight:600;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Met je account kun je:</p>
             <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
               <tr>
                 <td style="padding:4px 0;color:${BRAND.charcoal};font-size:14px;line-height:1.5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                   <span style="color:${BRAND.gold};margin-right:8px;">&#10003;</span> Je bestellingen bekijken en volgen
                 </td>
               </tr>
               <tr>
                 <td style="padding:4px 0;color:${BRAND.charcoal};font-size:14px;line-height:1.5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                   <span style="color:${BRAND.gold};margin-right:8px;">&#10003;</span> Adressen beheren voor sneller afrekenen
                 </td>
               </tr>
               <tr>
                 <td style="padding:4px 0;color:${BRAND.charcoal};font-size:14px;line-height:1.5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                   <span style="color:${BRAND.gold};margin-right:8px;">&#10003;</span> Je verlanglijstje synchroniseren
                 </td>
               </tr>
             </table>
           </td>
         </tr>
       </table>
     `)}
     ${button("Ga naar mijn account", `${BRAND.siteUrl}/account`)}
     ${signature()}`,
    `Welkom bij Vino per Lei, ${firstName} — je account is klaar`,
    "Account"
  );

  const text = `Welkom, ${firstName}!

Je persoonlijke account bij Vino per Lei is klaar. Met je account kun je:
- Je bestellingen bekijken en volgen
- Adressen beheren voor sneller afrekenen
- Je verlanglijstje synchroniseren

Ga naar je account: ${BRAND.siteUrl}/account

Met warme groet,
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
    `${heading("Goed nieuws voor jou!")}
     ${paragraph(`De wijn waar je op wachtte is weer beschikbaar. Bestel snel — Italiaanse wijnen van deze kwaliteit zijn vaak snel uitverkocht.`)}
     ${highlightBox(`
       <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
         <tr>
           <td style="padding:0;">
             <p style="margin:0 0 4px;color:${BRAND.grey};font-size:12px;text-transform:uppercase;letter-spacing:1px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Weer op voorraad</p>
             <p style="margin:0;color:${BRAND.wine};font-family:Georgia,'Times New Roman',serif;font-size:20px;">${productTitle}</p>
           </td>
         </tr>
       </table>
     `)}
     ${button("Nu bestellen", productUrl)}
     ${paragraph(`Of <a href="${BRAND.siteUrl}/wijnen" style="color:${BRAND.gold};text-decoration:none;font-weight:600;">bekijk alle wijnen</a> in onze collectie.`)}
     ${signature()}`,
    `${productTitle} is weer op voorraad bij Vino per Lei — bestel nu`,
    "Voorraadmelding"
  );

  const text = `Goed nieuws!

${productTitle} is weer op voorraad! Bestel snel, want de voorraad is beperkt.

Bekijk en bestel: ${productUrl}

Met warme groet,
Carla Daniels
Vino per Lei`;

  return { subject: `${productTitle} is weer op voorraad! 🍷`, html, text };
}
