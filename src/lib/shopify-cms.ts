import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import type { UiCopyMap } from "@/lib/ui-copy";

let _client: ReturnType<typeof createStorefrontApiClient> | null = null;

function getClient() {
  if (!_client) {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!domain || !token) {
      throw new Error("Missing Shopify env vars: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN must be set");
    }
    _client = createStorefrontApiClient({
      storeDomain: domain,
      apiVersion: "2026-01",
      publicAccessToken: token,
    });
  }
  return _client;
}

export interface SiteSettings {
  companyName: string;
  ownerName: string;
  phone: string;
  email: string;
  addressStreet: string;
  addressPostal: string;
  addressCity: string;
  kvk: string;
  btw: string;
  instagramUrl: string;
  facebookUrl: string;
  hoursWeekday: string;
  hoursSaturday: string;
  hoursSunday: string;
  freeShippingThreshold: number;
  shippingCost: number;
}

export interface HeroContent {
  subtitle: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
}

export interface AnnouncementBar {
  message: string;
  enabled: boolean;
  link: string;
}

export interface USPItem {
  title: string;
  subtitle: string;
  iconName: string;
  sortOrder: number;
}

export interface FAQItem {
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface WineRegionCMS {
  id: string;
  name: string;
  displayName: string;
  slug: string;
  description: string;
  famousWines: string[];
  area: string;
  active: boolean;
}

export interface CategoryBlock {
  name: string;
  description: string;
  href: string;
  iconType: string;
  sortOrder: number;
}

export interface BlogAuthor {
  name: string;
  bio: string;
}

export interface BlogArticle {
  title: string;
  handle: string;
  contentHtml: string;
  excerpt: string;
  publishedAt: string;
  image: { url: string; altText: string | null } | null;
  tags: string[];
  authorV2: BlogAuthor | null;
  seo: { title: string | null; description: string | null };
  readingTimeMinutes: number;
}

export interface ShopifyPage {
  title: string;
  body: string;
  bodySummary: string;
  updatedAt: string;
}

export interface MenuItem {
  title: string;
  url: string;
  items: MenuItem[];
}

export interface ShopifyMenu {
  title: string;
  items: MenuItem[];
}

export interface TestimonialCMS {
  name: string;
  text: string;
  rating: number;
  wine: string;
  attribution: string;
  sortOrder: number;
}

export interface HomeStatCMS {
  value: string;
  prefix: string;
  suffix: string;
  label: string;
  sortOrder: number;
}

export interface ShopConfig {
  freeShippingThreshold: number;
  shippingCost: number;
}

export interface UiCopyItem {
  key: string;
  value: string;
  group: string;
  description: string;
}

function parseFields(fields: Array<{ key: string; value: string }>): Record<string, string> {
  const map: Record<string, string> = {};
  for (const field of fields) {
    map[field.key] = field.value;
  }
  return map;
}

function parseNumber(value: string | undefined): number {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
}

async function getMetaobject<T>(
  type: string,
  handle: string,
  mapper: (fields: Record<string, string>) => T
): Promise<T | null> {
  try {
    const { data } = await getClient().request(
      `
      query getMetaobject($handle: MetaobjectHandleInput!) {
        metaobject(handle: $handle) {
          fields { key value }
        }
      }
    `,
      { variables: { handle: { type, handle } } }
    );
    if (!data?.metaobject) return null;
    return mapper(parseFields(data.metaobject.fields));
  } catch (error) {
    console.error(`Failed to fetch metaobject ${type}/${handle}:`, error);
    return null;
  }
}

async function getMetaobjects<T>(
  type: string,
  mapper: (fields: Record<string, string>, handle: string) => T
): Promise<T[]> {
  try {
    const nodes: Array<{ handle: string; fields: Array<{ key: string; value: string }> }> = [];
    let after: string | null = null;

    do {
      const response = await getClient().request(
        `
        query getMetaobjects($type: String!, $after: String) {
          metaobjects(type: $type, first: 250, after: $after) {
            nodes {
              handle
              fields { key value }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
        { variables: { type, after } }
      );
      const data = response.data as
        | {
            metaobjects?: {
              nodes?: Array<{ handle: string; fields: Array<{ key: string; value: string }> }>;
              pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
            };
          }
        | undefined;
      nodes.push(...(data?.metaobjects?.nodes ?? []));
      after = data?.metaobjects?.pageInfo?.hasNextPage
        ? data.metaobjects.pageInfo.endCursor ?? null
        : null;
    } while (after);

    return nodes.map((node) => mapper(parseFields(node.fields), node.handle));
  } catch (error) {
    console.error(`Failed to fetch metaobjects ${type}:`, error);
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return getMetaobject("site_settings", "main", (f) => ({
    companyName: f.company_name || "",
    ownerName: f.owner_name || "",
    phone: f.phone || "",
    email: f.email || "",
    addressStreet: f.address_street || "",
    addressPostal: f.address_postal || "",
    addressCity: f.address_city || "",
    kvk: f.kvk || "",
    btw: f.btw || "",
    instagramUrl: f.instagram_url || "",
    facebookUrl: f.facebook_url || "",
    hoursWeekday: f.hours_weekday || "",
    hoursSaturday: f.hours_saturday || "",
    hoursSunday: f.hours_sunday || "",
    freeShippingThreshold: parseNumber(f.gratis_verzending_drempel),
    shippingCost: parseNumber(f.verzendkosten),
  }));
}

export async function getHeroContent(): Promise<HeroContent | null> {
  return getMetaobject("homepage_hero", "main", (f) => ({
    subtitle: f.subtitle || "",
    titleLine1: f.title_line_1 || "",
    titleLine2: f.title_line_2 || "",
    description: f.description || "",
    ctaPrimaryText: f.cta_primary_text || "",
    ctaPrimaryLink: f.cta_primary_link || "",
    ctaSecondaryText: f.cta_secondary_text || "",
    ctaSecondaryLink: f.cta_secondary_link || "",
  }));
}

export async function getAnnouncementBar(): Promise<AnnouncementBar | null> {
  return getMetaobject("announcement_bar", "main", (f) => ({
    message: f.message || "",
    enabled: f.enabled === "true",
    link: f.link || "",
  }));
}

export async function getUiCopy(): Promise<UiCopyMap> {
  const items = await getMetaobjects<UiCopyItem>("ui_copy", (f, handle) => ({
    key: f.key || handle,
    value: f.value || "",
    group: f.group || "",
    description: f.description || "",
  }));

  return Object.fromEntries(items.filter((item) => item.key).map((item) => [item.key, item.value]));
}

export async function getUSPItems(): Promise<USPItem[]> {
  const items = await getMetaobjects<USPItem>("usp_item", (f) => ({
    title: f.title || "",
    subtitle: f.subtitle || "",
    iconName: f.icon_name || "",
    sortOrder: Number.parseInt(f.sort_order || "0", 10),
  }));
  return items.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getFAQItems(): Promise<FAQItem[]> {
  const items = await getMetaobjects<FAQItem>("faq_item", (f) => ({
    category: f.category || "",
    question: f.question || "",
    answer: f.answer || "",
    sortOrder: Number.parseInt(f.sort_order || "0", 10),
  }));
  return items.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getWineRegions(): Promise<WineRegionCMS[]> {
  return getMetaobjects<WineRegionCMS>("wine_region", (f, handle) => {
    let famousWines: string[] = [];
    try {
      famousWines = JSON.parse(f.famous_wines || "[]");
    } catch {
      famousWines = [];
    }
    return {
      id: handle,
      name: f.name || "",
      displayName: f.display_name || f.name || "",
      slug: f.slug || handle,
      description: f.description || "",
      famousWines,
      area: f.area || "",
      active: f.active !== "false",
    };
  });
}

export async function getCategoryBlocks(): Promise<CategoryBlock[]> {
  const items = await getMetaobjects<CategoryBlock>("category_block", (f) => ({
    name: f.name || "",
    description: f.description || "",
    href: f.href || "",
    iconType: f.icon_type || "",
    sortOrder: Number.parseInt(f.sort_order || "0", 10),
  }));
  return items.sort((a, b) => a.sortOrder - b.sortOrder);
}

async function getPageMetaobject(handle: string): Promise<ShopifyPage | null> {
  return getMetaobject<ShopifyPage>("page_content", handle, (f) => ({
    title: f.title || "",
    body: f.body || "",
    bodySummary: f.body_summary || "",
    updatedAt: f.updated_at || "",
  }));
}

export async function getPage(handle: string): Promise<ShopifyPage | null> {
  const metaobjectPage = await getPageMetaobject(handle);
  if (metaobjectPage) return metaobjectPage;

  try {
    const { data } = await getClient().request(
      `
      query getPage($handle: String!) {
        pageByHandle(handle: $handle) {
          title
          body
          bodySummary
          updatedAt
        }
      }
    `,
      { variables: { handle } }
    );
    return data?.pageByHandle ?? null;
  } catch (error) {
    console.error(`Failed to fetch page "${handle}":`, error);
    return null;
  }
}

const ARTICLE_FIELDS = `
  title
  handle
  contentHtml
  excerpt
  publishedAt
  image { url altText }
  tags
  authorV2 { name }
  seo { title description }
`;

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function mapArticle(node: Record<string, unknown>): BlogArticle {
  const contentHtml = (node.contentHtml as string) || "";
  const authorV2Raw = node.authorV2 as { name?: string; bio?: string } | null | undefined;
  const seoRaw = node.seo as { title?: string; description?: string } | null;
  return {
    title: (node.title as string) || "",
    handle: (node.handle as string) || "",
    contentHtml,
    excerpt: (node.excerpt as string) || "",
    publishedAt: (node.publishedAt as string) || "",
    image: node.image as BlogArticle["image"],
    tags: (node.tags as string[]) || [],
    authorV2: authorV2Raw?.name ? { name: authorV2Raw.name, bio: authorV2Raw.bio ?? "" } : null,
    seo: { title: seoRaw?.title || null, description: seoRaw?.description || null },
    readingTimeMinutes: estimateReadingTime(contentHtml),
  };
}

export async function getBlogArticles(first: number = 20): Promise<BlogArticle[]> {
  try {
    const response = await getClient().request(
      `
      query getBlogArticles($first: Int!) {
        blogs(first: 10) {
          nodes {
            articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
              nodes { ${ARTICLE_FIELDS} }
            }
          }
        }
      }
    `,
      { variables: { first } }
    );
    const { data, errors } = response as { data: typeof response.data; errors?: Array<{ message: string }> };
    if (errors?.length) {
      console.error("[getBlogArticles] Shopify GraphQL errors:", JSON.stringify(errors, null, 2));
    }
    const allArticles: BlogArticle[] = [];
    for (const blog of data?.blogs?.nodes ?? []) {
      for (const node of blog?.articles?.nodes ?? []) {
        allArticles.push(mapArticle(node));
      }
    }
    return allArticles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, first);
  } catch (error) {
    console.error("[getBlogArticles] Failed to fetch blog articles:", error instanceof Error ? error.message : error);
    return [];
  }
}

export async function getBlogArticlesByTag(tag: string, first: number = 20): Promise<BlogArticle[]> {
  try {
    const { data } = await getClient().request(
      `
      query getBlogArticlesByTag($first: Int!, $query: String!) {
        blogs(first: 10) {
          nodes {
            articles(first: $first, sortKey: PUBLISHED_AT, reverse: true, query: $query) {
              nodes { ${ARTICLE_FIELDS} }
            }
          }
        }
      }
    `,
      { variables: { first, query: `tag:${tag}` } }
    );
    const allArticles: BlogArticle[] = [];
    for (const blog of data?.blogs?.nodes ?? []) {
      for (const node of blog?.articles?.nodes ?? []) {
        allArticles.push(mapArticle(node));
      }
    }
    return allArticles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, first);
  } catch (error) {
    console.error(`[getBlogArticlesByTag] Failed to fetch articles by tag "${tag}":`, error instanceof Error ? error.message : error);
    return [];
  }
}

export async function getBlogArticleByHandle(handle: string): Promise<BlogArticle | null> {
  try {
    const allArticles = await getBlogArticles(50);
    return allArticles.find((article) => article.handle === handle) ?? null;
  } catch (error) {
    console.error(`Failed to fetch article "${handle}":`, error);
    return null;
  }
}

export async function getBlogTags(): Promise<string[]> {
  const articles = await getBlogArticles(50);
  const tagSet = new Set<string>();
  for (const article of articles) {
    for (const tag of article.tags) tagSet.add(tag);
  }
  return Array.from(tagSet).sort();
}

export async function getMenu(handle: string): Promise<MenuItem[]> {
  const menu = await getMenuWithTitle(handle);
  return menu?.items ?? [];
}

export async function getMenuWithTitle(handle: string): Promise<ShopifyMenu | null> {
  try {
    const { data } = await getClient().request(
      `
      query getMenu($handle: String!) {
        menu(handle: $handle) {
          title
          items {
            title
            url
            items {
              title
              url
              items {
                title
                url
              }
            }
          }
        }
      }
    `,
      { variables: { handle } }
    );
    return data?.menu ?? null;
  } catch (error) {
    console.error(`Failed to fetch menu "${handle}":`, error);
    return null;
  }
}

export async function getTestimonials(): Promise<TestimonialCMS[]> {
  const items = await getMetaobjects<TestimonialCMS>("testimonial", (f) => ({
    name: f.name || "",
    text: f.text || "",
    rating: Number.parseInt(f.rating || "0", 10),
    wine: f.wine || "",
    attribution: f.attribution || "",
    sortOrder: Number.parseInt(f.sort_order || "0", 10),
  }));
  return items.filter((testimonial) => testimonial.name && testimonial.text).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getHomeStats(): Promise<HomeStatCMS[]> {
  const items = await getMetaobjects<HomeStatCMS>("homepage_stat", (f) => ({
    value: f.value || "0",
    prefix: f.prefix || "",
    suffix: f.suffix || "",
    label: f.label || "",
    sortOrder: Number.parseInt(f.sort_order || "0", 10),
  }));
  return items.filter((stat) => stat.label).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getShopConfig(): Promise<ShopConfig> {
  const settings = await getSiteSettings();
  return {
    freeShippingThreshold: settings?.freeShippingThreshold ?? 0,
    shippingCost: settings?.shippingCost ?? 0,
  };
}
