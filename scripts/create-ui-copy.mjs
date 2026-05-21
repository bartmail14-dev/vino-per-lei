const STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

const entries = [
  // Auth
  ['auth-email-label', 'auth.email_label', 'E-mailadres', 'auth', 'Label voor e-mail veld in login/register'],
  ['auth-password-label', 'auth.password_label', 'Wachtwoord', 'auth', 'Label voor wachtwoord veld'],
  ['auth-firstname-label', 'auth.firstname_label', 'Voornaam', 'auth', 'Label voornaam registratie'],
  ['auth-lastname-label', 'auth.lastname_label', 'Achternaam', 'auth', 'Label achternaam registratie'],
  ['auth-forgot-password', 'auth.forgot_password', 'Wachtwoord vergeten?', 'auth', 'Link wachtwoord vergeten'],
  ['auth-back-to-login', 'auth.back_to_login', 'Terug naar inloggen', 'auth', 'Link terug naar login'],
  ['auth-recover-description', 'auth.recover_description', 'Voer je e-mailadres in en we sturen je een link om je wachtwoord te resetten.', 'auth', 'Uitleg wachtwoord reset'],
  ['auth-recover-submit', 'auth.recover_submit', 'Verstuur reset link', 'auth', 'Knop reset link versturen'],
  ['auth-recover-submitting', 'auth.recover_submitting', 'Versturen...', 'auth', 'Loading tekst reset'],
  ['auth-recover-sent-message', 'auth.recover_sent_message', 'Als er een account bestaat met dit e-mailadres, ontvang je binnen enkele minuten een e-mail met instructies om je wachtwoord te resetten.', 'auth', 'Bevestiging reset verstuurd'],
  ['auth-recover-check-spam', 'auth.recover_check_spam', 'Controleer ook je spam-map.', 'auth', 'Spam hint bij reset'],
  ['auth-title-login', 'auth.title_login', 'Inloggen', 'auth', 'Modal titel login'],
  ['auth-title-register', 'auth.title_register', 'Account aanmaken', 'auth', 'Modal titel registratie'],
  ['auth-title-recover', 'auth.title_recover', 'Wachtwoord resetten', 'auth', 'Modal titel reset'],
  ['auth-title-recover-sent', 'auth.title_recover_sent', 'E-mail verstuurd', 'auth', 'Modal titel reset verstuurd'],
  // Account
  ['account-tab-orders', 'account.tab_orders', 'Bestellingen', 'account', 'Tab label bestellingen'],
  ['account-tab-addresses', 'account.tab_addresses', 'Adressen', 'account', 'Tab label adressen'],
  ['account-tab-profile', 'account.tab_profile', 'Profiel', 'account', 'Tab label profiel'],
  ['account-welcome', 'account.welcome', 'Welkom', 'account', 'Welkomstgroet account pagina'],
  ['account-no-orders', 'account.no_orders', 'Je hebt nog geen bestellingen geplaatst.', 'account', 'Lege staat bestellingen'],
  ['account-browse-wines', 'account.browse_wines', 'Ontdek onze wijnen', 'account', 'CTA lege bestellingen'],
  ['account-order-prefix', 'account.order_prefix', 'Bestelling', 'account', 'Prefix voor bestelnummer'],
  ['account-view-status', 'account.view_status', 'Bekijk bestelstatus', 'account', 'Link bestelstatus'],
  ['account-no-addresses', 'account.no_addresses', 'Je hebt nog geen adressen opgeslagen.', 'account', 'Lege staat adressen'],
  ['account-addresses-hint', 'account.addresses_hint', 'Adressen worden automatisch opgeslagen bij je eerste bestelling.', 'account', 'Hint lege adressen'],
  ['account-default-address', 'account.default_address', 'Standaard adres', 'account', 'Label standaard adres'],
  ['account-profile-title', 'account.profile_title', 'Accountgegevens', 'account', 'Titel profiel sectie'],
  ['account-profile-name', 'account.profile_name', 'Naam', 'account', 'Label naam in profiel'],
  ['account-profile-email', 'account.profile_email', 'E-mail', 'account', 'Label e-mail in profiel'],
  ['account-change-password-title', 'account.change_password_title', 'Wachtwoord wijzigen', 'account', 'Titel wachtwoord wijzigen'],
  ['account-change-password-desc', 'account.change_password_desc', 'Je kunt je wachtwoord resetten via e-mail.', 'account', 'Uitleg wachtwoord wijzigen'],
  ['account-reset-password', 'account.reset_password', 'Wachtwoord resetten', 'account', 'Link wachtwoord resetten'],
  ['account-logout', 'account.logout', 'Uitloggen', 'account', 'Uitlog knop'],
  ['account-login-required', 'account.login_required', 'Je moet ingelogd zijn om deze pagina te bekijken.', 'account', 'Melding niet ingelogd'],
  ['account-login-button', 'account.login_button', 'Inloggen', 'account', 'Login knop bij niet-ingelogd'],
  ['account-browse-collection', 'account.browse_collection', 'Bekijk onze collectie', 'account', 'Quick link naar collectie'],
  ['account-status-paid', 'account.status_paid', 'Betaald', 'account', 'Bestelstatus betaald'],
  ['account-status-pending', 'account.status_pending', 'In afwachting', 'account', 'Bestelstatus in afwachting'],
  ['account-status-refunded', 'account.status_refunded', 'Terugbetaald', 'account', 'Bestelstatus terugbetaald'],
  ['account-status-fulfilled', 'account.status_fulfilled', 'Verzonden', 'account', 'Bestelstatus verzonden'],
  ['account-status-unfulfilled', 'account.status_unfulfilled', 'In verwerking', 'account', 'Bestelstatus in verwerking'],
  ['account-status-partially-fulfilled', 'account.status_partially_fulfilled', 'Deels verzonden', 'account', 'Bestelstatus deels verzonden'],
];

async function createEntry([handle, key, value, group, description]) {
  const mutation = `mutation {
    metaobjectCreate(metaobject: {
      type: "ui_copy",
      handle: "${handle}",
      fields: [
        { key: "key", value: "${key}" },
        { key: "value", value: ${JSON.stringify(JSON.stringify(value))} },
        { key: "group", value: "${group}" },
        { key: "description", value: ${JSON.stringify(JSON.stringify(description))} }
      ]
    }) {
      metaobject { handle }
      userErrors { field message }
    }
  }`;

  const res = await fetch(`https://${STORE}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
    body: JSON.stringify({ query: mutation })
  });
  const json = await res.json();
  const errors = json.data?.metaobjectCreate?.userErrors;
  if (errors?.length > 0) {
    console.log(`SKIP ${handle}: ${errors[0].message}`);
    return "skip";
  } else {
    console.log(`OK ${handle}`);
    return "ok";
  }
}

(async () => {
  let ok = 0;
  let skip = 0;
  for (const entry of entries) {
    const result = await createEntry(entry);
    if (result === "ok") ok += 1;
    if (result === "skip") skip += 1;
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100));
  }
  console.log(`\nDone! Processed ${entries.length} entries. OK: ${ok}, skipped: ${skip}.`);
})();
