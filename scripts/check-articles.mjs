import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: 'vino-per-lei-2.myshopify.com',
  apiVersion: '2026-01',
  publicAccessToken: 'ded4b32a0bba7215c405301e3b57a764',
});

const { data } = await client.request(`{
  blog(handle: "wijn-verhalen") {
    articles(first: 10, sortKey: PUBLISHED_AT, reverse: true) {
      nodes {
        title
        handle
        tags
        publishedAt
        excerpt
        image { url }
        contentHtml
      }
    }
  }
}`);

const articles = data?.blog?.articles?.nodes || [];
console.log(`Found ${articles.length} articles\n`);
articles.forEach(a => {
  console.log('---');
  console.log('Title:', a.title);
  console.log('Handle:', a.handle);
  console.log('Tags:', a.tags?.join(', ') || 'none');
  console.log('Image:', a.image ? 'YES' : 'NO');
  console.log('Content length:', a.contentHtml?.length, 'chars');
  console.log('Content preview:', a.contentHtml?.substring(0, 300));
  console.log();
});
