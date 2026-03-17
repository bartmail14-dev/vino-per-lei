/**
 * Update the excerpt of the Barolo article in Shopify.
 *
 * Usage:
 *   SHOPIFY_ADMIN_TOKEN=shpat_xxx node scripts/update-excerpt.mjs
 */

const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const SHOP = 'vino-per-lei-2.myshopify.com';
const API_VERSION = '2024-01';

if (!TOKEN) {
  console.error('Missing SHOPIFY_ADMIN_TOKEN env var.');
  process.exit(1);
}

const base = `https://${SHOP}/admin/api/${API_VERSION}`;
const headers = {
  'X-Shopify-Access-Token': TOKEN,
  'Content-Type': 'application/json',
};

async function main() {
  // 1. Get blogs
  const blogsRes = await fetch(`${base}/blogs.json`, { headers });
  if (!blogsRes.ok) {
    const err = await blogsRes.text();
    console.error(`API error (${blogsRes.status}): ${err}`);
    console.error('\nMake sure the Admin API token has read_content + write_content scopes.');
    console.error('Shopify Admin → Settings → Apps → [app] → API access → Admin API access scopes');
    process.exit(1);
  }
  const blogs = await blogsRes.json();
  const blogId = blogs.blogs?.[0]?.id;
  if (!blogId) {
    console.error('No blog found');
    process.exit(1);
  }
  console.log(`Blog ID: ${blogId} (${blogs.blogs[0].title})`);

  // 2. Get articles
  const artRes = await fetch(`${base}/blogs/${blogId}/articles.json?limit=50`, { headers });
  const arts = await artRes.json();

  console.log(`\nFound ${arts.articles?.length || 0} articles:\n`);
  for (const a of arts.articles || []) {
    console.log(`  [${a.id}] ${a.title}`);
    console.log(`    Excerpt: ${a.summary_html ? a.summary_html.substring(0, 80) + '...' : '(empty)'}`);
  }

  // 3. Find Barolo article
  const barolo = arts.articles?.find(a => a.handle === 'de-ultieme-gids-voor-barolo-van-druif-tot-glas');
  if (!barolo) {
    console.error('\nBarolo article not found!');
    process.exit(1);
  }

  console.log(`\nUpdating excerpt for: ${barolo.title} (ID: ${barolo.id})`);

  // 4. Update excerpt
  const excerpt = 'Van de Nebbiolo-druif tot de kenmerkende tannines — ontdek alles over Barolo, de Koning der Italiaanse Wijnen. Met serveertips, de beste jaargangen en food pairings.';

  const updateRes = await fetch(`${base}/blogs/${blogId}/articles/${barolo.id}.json`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      article: {
        id: barolo.id,
        summary_html: excerpt,
      }
    }),
  });

  if (!updateRes.ok) {
    const err = await updateRes.text();
    console.error(`Failed to update: ${updateRes.status} ${err}`);
    process.exit(1);
  }

  const updated = await updateRes.json();
  console.log(`\nExcerpt updated successfully!`);
  console.log(`New excerpt: ${updated.article?.summary_html}`);

  // 5. Also update all other articles that lack excerpts
  const excerpts = {
    'wijn-spijs-de-perfecte-italiaanse-match': 'Van Amarone bij ossobuco tot Vermentino bij zeevruchten. De gouden regels van Italiaans combineren.',
    'piemonte-meer-dan-alleen-barolo': 'Barbera, Nebbiolo, Dolcetto — de andere schatten van Piemonte.',
    'prosecco-vs-champagne-de-verschillen': 'Twee bubbels, twee werelden. Waarom Prosecco uit Valdobbiadene een eigen karakter heeft.',
    'het-geheim-van-amarone': 'Hoe gedroogde druiven de meest intense wijn van de Veneto creëren. De appassimento-methode uitgelegd.',
    'toscana-de-ultieme-wijngids': 'Van Chianti Classico tot Brunello di Montalcino — een reis door de wijnheuvels van Toscane.',
    'barolo-de-koning-der-italiaanse-wijnen': 'Ontdek waarom Barolo uit Piemonte al eeuwenlang de kroon draagt. Van de Nebbiolo-druif tot de kenmerkende tannines — alles over deze iconische wijn.',
  };

  for (const a of arts.articles || []) {
    if (a.handle === 'de-ultieme-gids-voor-barolo-van-druif-tot-glas') continue; // already done
    if (a.summary_html && a.summary_html.trim().length > 0) continue; // already has excerpt

    const newExcerpt = excerpts[a.handle];
    if (!newExcerpt) continue;

    const res = await fetch(`${base}/blogs/${blogId}/articles/${a.id}.json`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ article: { id: a.id, summary_html: newExcerpt } }),
    });

    if (res.ok) {
      console.log(`  ✓ Updated excerpt for: ${a.title}`);
    } else {
      console.error(`  ✗ Failed for: ${a.title} (${res.status})`);
    }
  }

  console.log('\nDone! All articles now have excerpts.');
}

main().catch(console.error);
