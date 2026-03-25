import type { Metadata } from "next";
import Link from "next/link";
import { getPage } from "@/lib/shopify-cms";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Cookiebeleid | Vino per Lei",
  description:
    "Lees welke cookies Vino per Lei gebruikt en hoe je deze kunt beheren.",
};

export default async function CookiesPage() {
  const page = await getPage("cookiebeleid");

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Juridisch</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            {page?.title ?? "Cookiebeleid"}
          </h1>
          <p className="text-grey text-sm">
            Laatst bijgewerkt:{" "}
            {page?.updatedAt
              ? new Date(page.updatedAt).toLocaleDateString("nl-NL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "25 maart 2026"}
          </p>
        </div>

        {/* Content */}
        {page?.body ? (
          <div
            className="prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.body) }}
          />
        ) : (
          <CookieFallback />
        )}

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-sand">
          <Link
            href="/"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            &larr; Terug naar de homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Hardcoded Dutch cookie policy fallback when CMS returns null. */
function CookieFallback() {
  const prose =
    "prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2";

  return (
    <div className={prose}>
      <h2>1. Wat zijn cookies?</h2>
      <p>
        Cookies zijn kleine tekstbestanden die door een website op je computer, tablet of smartphone
        worden geplaatst wanneer je de site bezoekt. Ze helpen de website om je apparaat te herkennen
        en zorgen ervoor dat de site goed functioneert.
      </p>

      <h2>2. Welke cookies gebruiken wij?</h2>

      <h3>Noodzakelijke cookies</h3>
      <p>Deze cookies zijn essentieel voor het functioneren van de website en kunnen niet worden uitgeschakeld.</p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Doel</th>
              <th>Bewaartermijn</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>vpl_age_verified</code></td>
              <td>Onthoudt dat je hebt bevestigd 18 jaar of ouder te zijn</td>
              <td>30 dagen</td>
            </tr>
            <tr>
              <td><code>vpl_cookie_consent</code></td>
              <td>Slaat je cookiekeuze op</td>
              <td>1 jaar</td>
            </tr>
            <tr>
              <td><code>vpl_csrf</code></td>
              <td>Beveiliging tegen cross-site request forgery</td>
              <td>Sessie</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Functionele cookies</h3>
      <p>Deze cookies onthouden je voorkeuren en verbeteren je gebruikerservaring.</p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Cookie / opslag</th>
              <th>Doel</th>
              <th>Bewaartermijn</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>vpl_cart</code> (localStorage)</td>
              <td>Bewaart de inhoud van je winkelwagen</td>
              <td>Tot je de wagen leegmaakt of browserdata wist</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Analytische cookies</h3>
      <p>
        Deze cookies worden <strong>alleen geplaatst met jouw toestemming</strong> en helpen ons
        inzicht te krijgen in hoe bezoekers de website gebruiken, zodat wij deze kunnen verbeteren.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Doel</th>
              <th>Bewaartermijn</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>_ga</code>, <code>_ga_*</code></td>
              <td>Google Analytics &mdash; anonieme bezoekstatistieken</td>
              <td>26 maanden</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Marketing cookies</h3>
      <p>
        Deze cookies worden <strong>alleen geplaatst met jouw toestemming</strong> en worden gebruikt
        om het effect van onze nieuwsbriefcampagnes te meten (bijv. open-rate tracking via Mailgun).
      </p>

      <h2>3. Hoe kun je cookies beheren?</h2>
      <p>
        Je kunt cookies beheren of verwijderen via de instellingen van je browser. Hieronder vind je
        instructies voor de meest gebruikte browsers:
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/nl/kb/cookies-verwijderen" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/nl-nl/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/nl-nl/microsoft-edge/cookies-in-microsoft-edge-verwijderen-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>
      <p>
        <strong>Let op:</strong> het uitschakelen van noodzakelijke cookies kan ertoe leiden dat de
        website niet goed functioneert.
      </p>

      <h2>4. Toestemming intrekken</h2>
      <p>
        Je kunt je cookievoorkeuren op elk moment wijzigen door onderaan de pagina op
        &ldquo;Cookie-instellingen&rdquo; te klikken. Dit opent de cookiebanner opnieuw, waarna je
        je keuze kunt aanpassen.
      </p>

      <h2>5. Contact</h2>
      <p>
        Heb je vragen over ons cookiebeleid? Neem contact met ons op via{" "}
        <a href="mailto:info@vinoperlei.nl">info@vinoperlei.nl</a>.
      </p>
    </div>
  );
}
