import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2026-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

// --- Types ---

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
  pinterestUrl: string;
  hoursWeekday: string;
  hoursSaturday: string;
  hoursSunday: string;
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

export interface BlogArticle {
  title: string;
  handle: string;
  contentHtml: string;
  excerpt: string;
  publishedAt: string;
  image: { url: string; altText: string | null } | null;
  tags: string[];
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

// --- Helpers ---

function parseFields(fields: Array<{ key: string; value: string }>): Record<string, string> {
  const map: Record<string, string> = {};
  for (const f of fields) {
    map[f.key] = f.value;
  }
  return map;
}

// --- Metaobject Queries ---

async function getMetaobject<T>(
  type: string,
  handle: string,
  mapper: (fields: Record<string, string>) => T
): Promise<T | null> {
  try {
    const { data } = await client.request(`
      query getMetaobject($handle: MetaobjectHandleInput!) {
        metaobject(handle: $handle) {
          fields { key value }
        }
      }
    `, { variables: { handle: { type, handle } } });
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
    const { data } = await client.request(`
      query getMetaobjects($type: String!) {
        metaobjects(type: $type, first: 100) {
          nodes {
            handle
            fields { key value }
          }
        }
      }
    `, { variables: { type } });
    return (data?.metaobjects?.nodes ?? []).map(
      (node: { handle: string; fields: Array<{ key: string; value: string }> }) =>
        mapper(parseFields(node.fields), node.handle)
    );
  } catch (error) {
    console.error(`Failed to fetch metaobjects ${type}:`, error);
    return [];
  }
}

// --- Public API ---

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return getMetaobject('site_settings', 'main', (f) => ({
    companyName: f.company_name || 'Vino per Lei',
    ownerName: f.owner_name || '',
    phone: f.phone || '',
    email: f.email || 'info@vinoperlei.nl',
    addressStreet: f.address_street || '',
    addressPostal: f.address_postal || '',
    addressCity: f.address_city || '',
    kvk: f.kvk || '',
    btw: f.btw || '',
    instagramUrl: f.instagram_url || '',
    facebookUrl: f.facebook_url || '',
    pinterestUrl: f.pinterest_url || '',
    hoursWeekday: f.hours_weekday || '09:00 - 17:00',
    hoursSaturday: f.hours_saturday || 'Gesloten',
    hoursSunday: f.hours_sunday || 'Gesloten',
  }));
}

export async function getHeroContent(): Promise<HeroContent | null> {
  return getMetaobject('homepage_hero', 'main', (f) => ({
    subtitle: f.subtitle || '',
    titleLine1: f.title_line_1 || '',
    titleLine2: f.title_line_2 || '',
    description: f.description || '',
    ctaPrimaryText: f.cta_primary_text || '',
    ctaPrimaryLink: f.cta_primary_link || '/wijnen',
    ctaSecondaryText: f.cta_secondary_text || '',
    ctaSecondaryLink: f.cta_secondary_link || '/over-ons',
  }));
}

export async function getAnnouncementBar(): Promise<AnnouncementBar | null> {
  return getMetaobject('announcement_bar', 'main', (f) => ({
    message: f.message || '',
    enabled: f.enabled === 'true',
    link: f.link || '',
  }));
}

export async function getUSPItems(): Promise<USPItem[]> {
  const items = await getMetaobjects<USPItem>('usp_item', (f) => ({
    title: f.title || '',
    subtitle: f.subtitle || '',
    iconName: f.icon_name || 'truck',
    sortOrder: parseInt(f.sort_order || '0'),
  }));
  return items.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getFAQItems(): Promise<FAQItem[]> {
  const items = await getMetaobjects<FAQItem>('faq_item', (f) => ({
    category: f.category || '',
    question: f.question || '',
    answer: f.answer || '',
    sortOrder: parseInt(f.sort_order || '0'),
  }));
  return items.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getWineRegions(): Promise<WineRegionCMS[]> {
  return getMetaobjects<WineRegionCMS>('wine_region', (f, handle) => {
    let famousWines: string[] = [];
    try { famousWines = JSON.parse(f.famous_wines || '[]'); } catch { /* ignore */ }
    return {
      id: handle,
      name: f.name || '',
      displayName: f.display_name || f.name || '',
      slug: f.slug || handle,
      description: f.description || '',
      famousWines,
      area: f.area || 'north',
      active: f.active !== 'false',
    };
  });
}

export async function getCategoryBlocks(): Promise<CategoryBlock[]> {
  const items = await getMetaobjects<CategoryBlock>('category_block', (f) => ({
    name: f.name || '',
    description: f.description || '',
    href: f.href || '/wijnen',
    iconType: f.icon_type || 'red',
    sortOrder: parseInt(f.sort_order || '0'),
  }));
  return items.sort((a, b) => a.sortOrder - b.sortOrder);
}

// --- Shopify Pages ---

export async function getPage(handle: string): Promise<ShopifyPage | null> {
  try {
    const { data } = await client.request(`
      query getPage($handle: String!) {
        pageByHandle(handle: $handle) {
          title
          body
          bodySummary
          updatedAt
        }
      }
    `, { variables: { handle } });
    if (!data?.pageByHandle) return null;
    return data.pageByHandle;
  } catch (error) {
    console.error(`Failed to fetch page "${handle}":`, error);
    return null;
  }
}

// --- Blog ---

export async function getBlogArticles(first: number = 20): Promise<BlogArticle[]> {
  try {
    const { data } = await client.request(`
      query getBlogArticles($first: Int!) {
        blog(handle: "wijn-verhalen") {
          articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
            nodes {
              title
              handle
              contentHtml
              excerpt
              publishedAt
              image { url altText }
              tags
            }
          }
        }
      }
    `, { variables: { first } });
    return data?.blog?.articles?.nodes ?? [];
  } catch (error) {
    console.error('Failed to fetch blog articles:', error);
    return [];
  }
}

export async function getBlogArticleByHandle(handle: string): Promise<BlogArticle | null> {
  try {
    const { data } = await client.request(`
      query getBlogArticle($blogHandle: String!, $articleHandle: String!) {
        blog(handle: $blogHandle) {
          articleByHandle(handle: $articleHandle) {
            title
            handle
            contentHtml
            excerpt
            publishedAt
            image { url altText }
            tags
          }
        }
      }
    `, { variables: { blogHandle: 'wijn-verhalen', articleHandle: handle } });
    return data?.blog?.articleByHandle ?? null;
  } catch (error) {
    console.error(`Failed to fetch article "${handle}":`, error);
    return null;
  }
}

// --- Menus ---

export async function getMenu(handle: string): Promise<MenuItem[]> {
  try {
    const { data } = await client.request(`
      query getMenu($handle: String!) {
        menu(handle: $handle) {
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
    `, { variables: { handle } });
    return data?.menu?.items ?? [];
  } catch (error) {
    console.error(`Failed to fetch menu "${handle}":`, error);
    return [];
  }
}

// --- Defaults (fallbacks when Shopify CMS not yet populated) ---

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: 'Vino per Lei',
  ownerName: 'Carla Daniels',
  phone: '040-XXX XXXX',
  email: 'info@vinoperlei.nl',
  addressStreet: 'Pastorielaan 56',
  addressPostal: '5504 CR',
  addressCity: 'Veldhoven',
  kvk: '98874977',
  btw: 'NL005360033B10',
  instagramUrl: 'https://instagram.com/vinoperlei',
  facebookUrl: 'https://facebook.com/vinoperlei',
  pinterestUrl: 'https://pinterest.com/vinoperlei',
  hoursWeekday: '09:00 - 17:00',
  hoursSaturday: '10:00 - 14:00',
  hoursSunday: 'Gesloten',
};

export const DEFAULT_HERO: HeroContent = {
  subtitle: 'Authentieke Italiaanse Wijnen',
  titleLine1: 'La Dolce Vita',
  titleLine2: 'in Elk Glas',
  description: 'Ontdek onze zorgvuldig geselecteerde collectie Italiaanse wijnen. Van krachtige Barolo tot frisse Pinot Grigio.',
  ctaPrimaryText: 'Bekijk Collectie',
  ctaPrimaryLink: '/wijnen',
  ctaSecondaryText: 'Ons Verhaal',
  ctaSecondaryLink: '/over-ons',
};

export const DEFAULT_ANNOUNCEMENT: AnnouncementBar = {
  message: 'Welkom! Gebruik code WELKOM10 voor 10% korting op je eerste bestelling',
  enabled: true,
  link: '/wijnen',
};
