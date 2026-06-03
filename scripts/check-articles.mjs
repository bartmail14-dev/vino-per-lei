import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const publicAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!storeDomain || !publicAccessToken) {
  throw new Error("Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN");
}

const client = createStorefrontApiClient({
  storeDomain,
  apiVersion: '2026-01',
  publicAccessToken,
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
