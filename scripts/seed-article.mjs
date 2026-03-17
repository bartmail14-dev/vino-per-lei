/**
 * Seed a rich demo blog article in Shopify.
 *
 * REQUIRES: Admin API token with `write_content` scope.
 *
 * Usage:
 *   node scripts/seed-article.mjs
 *
 * The token in .env.local currently lacks this scope.
 * To fix: Shopify Admin → Settings → Apps and sales channels →
 *   [your custom app] → API access → Admin API access scopes →
 *   enable "read_content" + "write_content" → Save → Reinstall app
 */

const SHOP = 'vino-per-lei-2.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

if (!TOKEN) {
  console.error('Missing SHOPIFY_ADMIN_TOKEN env var. Set it in .env.local or pass inline:\n  SHOPIFY_ADMIN_TOKEN=shpat_xxx node scripts/seed-article.mjs');
  process.exit(1);
}

const ARTICLE_HTML = `
<p>Er zijn weinig wijnen die zoveel respect en bewondering afdwingen als de Barolo. In de mistige heuvels van de Langhe, waar de Nebbiolo-druif al eeuwen groeit, ontstaat een wijn die met recht "de Koning der Wijnen" wordt genoemd. Maar wat maakt deze wijn zo bijzonder? En hoe kies je de juiste fles?</p>

<h2>De Langhe: Waar Magie Ontstaat</h2>

<p>De Langhe is een van de meest betoverende wijngebieden ter wereld. Glooiende heuvels, middeleeuwse dorpjes en wijngaarden zover het oog reikt. Het microklimaat — warme zomers, koele herfsten en de beroemde <em>nebbia</em> (mist) — creëert perfecte omstandigheden voor de Nebbiolo-druif.</p>

<p>De kalkhoudende kleigrond geeft de wijn zijn minerale karakter. Elk dorp heeft zijn eigen <em>cru</em>, vergelijkbaar met de Grand Crus van Bourgogne. De bekendste zijn <strong>Cannubi</strong> in Barolo, <strong>Brunate</strong> op de grens van La Morra en Barolo, en <strong>Monfortino</strong> in Serralunga d'Alba.</p>

<blockquote>
<p>"Barolo is geen wijn die je drinkt. Het is een wijn die je beleeft. Elke slok vertelt het verhaal van de heuvels, de seizoenen, en de handen die hem maakten."</p>
</blockquote>

<h2>De Nebbiolo-druif: Elegant en Veeleisend</h2>

<p>Nebbiolo is een van de lastigste druivenrassen om te verbouwen. De druif rijpt laat — vaak pas eind oktober — en is extreem gevoelig voor terroir. Maar wanneer alles samenkomt, produceert hij wijnen van ongekende elegantie.</p>

<p>Kenmerken van Nebbiolo:</p>
<ul>
<li><strong>Kleur:</strong> Verrassend licht — granaatrood met oranje tinten, vooral bij oudere jaargangen</li>
<li><strong>Aroma's:</strong> Rozen, teer, kersen, truffel, leer en gedroogde kruiden</li>
<li><strong>Tannines:</strong> Stevig maar fijnmazig, die met de jaren zijdezacht worden</li>
<li><strong>Zuurgraad:</strong> Hoog, wat de wijn een indrukwekkend verouderingspotentieel geeft</li>
</ul>

<h2>Modernisten vs. Traditionalisten</h2>

<p>In de jaren '80 ontstond een debat dat de Barolo-wereld zou veranderen. De <strong>traditionalisten</strong> — wijnmakers als Bartolo Mascarello en Giacomo Conterno — hielden vast aan lange maceratie en grote Slavonische eiken vaten. Het resultaat: tanninerijke wijnen die decennia nodig hadden om te openen.</p>

<p>De <strong>modernisten</strong> — aangevoerd door Elio Altare en de "Barolo Boys" — experimenteerden met kortere maceratie, roterende tanks en kleine Franse barriques. Hun wijnen waren eerder toegankelijk, fruitiger en zachter.</p>

<blockquote>
<p>Vandaag de dag is het onderscheid vervaagd. De beste producenten combineren elementen van beide filosofieën en laten het terroir spreken.</p>
</blockquote>

<h2>De Beste Jaargangen</h2>

<p>Niet elk jaar is een groot Barolo-jaar. De Nebbiolo-druif is grillig en het weer in Piemonte onvoorspelbaar. Enkele uitzonderlijke jaargangen:</p>

<ul>
<li><strong>2016</strong> — Misschien wel het beste jaar ooit. Perfecte balans, ongelooflijke concentratie</li>
<li><strong>2019</strong> — Klassiek en elegant, met prachtige frisheid</li>
<li><strong>2010</strong> — Krachtig en gestructureerd, nu op zijn hoogtepunt</li>
<li><strong>2006</strong> — Sensueel en verfijnd, ideaal om nu te openen</li>
<li><strong>2001</strong> — Tijdloos, nog steeds aan het evolueren</li>
</ul>

<h2>Barolo aan Tafel</h2>

<p>Barolo is een gastronomische wijn bij uitstek. De combinaties zijn eindeloos, maar sommige zijn klassiekers:</p>

<ul>
<li><strong>Truffelrisotto</strong> — Dé combinatie. De aardse tonen van de truffel en de teer-achtige complexiteit van Barolo versterken elkaar</li>
<li><strong>Brasato al Barolo</strong> — Rundvlees gestoofd in Barolo. Circulair, perfect, onovertrefbaar</li>
<li><strong>Tajarin al ragù</strong> — Fijne ei-pasta met vleessaus, een Piemontese klassieker</li>
<li><strong>Gerijpte kaas</strong> — Parmigiano Reggiano (36+ maanden) of Castelmagno uit Piemonte</li>
</ul>

<h3>Serveertips</h3>

<p>Open je Barolo minstens <strong>twee uur</strong> voor het serveren, of gebruik een karaf. Serveer op 16-18°C — niet te warm, niet te koud. Een groot, tulpvormig glas laat de complexe aroma's het best tot hun recht komen.</p>

<hr>

<p>Bij Vino per Lei selecteren wij Barolo's van kleine, gepassioneerde producenten. Geen massaproductie, maar wijnen met een verhaal. Ontdek onze <a href="/wijnen">huidige selectie</a> en laat je verrassen door de koning onder de Italiaanse wijnen.</p>
`;

async function main() {
  // First get blog ID
  const blogsRes = await fetch(
    `https://${SHOP}/admin/api/2024-10/blogs.json`,
    { headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' } }
  );

  if (!blogsRes.ok) {
    const err = await blogsRes.json();
    console.error('Cannot access blogs API. Token needs read_content + write_content scopes.');
    console.error('Error:', JSON.stringify(err, null, 2));
    console.log('\nTo fix:');
    console.log('1. Go to Shopify Admin → Settings → Apps and sales channels');
    console.log('2. Click your custom app → Configuration → Admin API access scopes');
    console.log('3. Enable: read_content, write_content');
    console.log('4. Save → Install/Reinstall app');
    console.log('5. Copy new token to .env.local and re-run this script');
    return;
  }

  const { blogs } = await blogsRes.json();
  const blog = blogs.find(b => b.handle === 'wijn-verhalen');

  if (!blog) {
    console.error('Blog "wijn-verhalen" not found');
    return;
  }

  console.log(`Found blog: ${blog.title} (ID: ${blog.id})`);

  // Create article
  const articleRes = await fetch(
    `https://${SHOP}/admin/api/2024-10/blogs/${blog.id}/articles.json`,
    {
      method: 'POST',
      headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        article: {
          title: 'De Ultieme Gids voor Barolo: Van Druif tot Glas',
          body_html: ARTICLE_HTML,
          tags: 'piemonte, wijnkennis, regiogids',
          published: true,
          summary_html: 'Ontdek alles over Barolo — van de mistige heuvels van de Langhe tot de beste jaargangen en food pairings. Een reis door de wereld van de Koning der Wijnen.',
          metafields: [
            {
              namespace: 'seo',
              key: 'title',
              value: 'De Ultieme Gids voor Barolo | Vino per Lei',
              type: 'single_line_text_field'
            },
            {
              namespace: 'seo',
              key: 'description',
              value: 'Alles over Barolo: de Nebbiolo-druif, beste jaargangen, modernisten vs traditionalisten, en perfecte food pairings. Lees de complete gids.',
              type: 'single_line_text_field'
            }
          ]
        }
      })
    }
  );

  if (articleRes.ok) {
    const { article } = await articleRes.json();
    console.log(`\nArticle created!`);
    console.log(`Title: ${article.title}`);
    console.log(`Handle: ${article.handle}`);
    console.log(`URL: https://vino-per-lei.vercel.app/blog/${article.handle}`);
  } else {
    const err = await articleRes.json();
    console.error('Failed to create article:', JSON.stringify(err, null, 2));
  }
}

main().catch(console.error);
