import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Lazy-init: avoid throwing at module evaluation when env vars are missing (e.g. build without .env)
let _client: ReturnType<typeof createStorefrontApiClient> | null = null;
function getClient() {
  if (!_client) {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!domain || !token) {
      throw new Error('Missing Shopify env vars: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN must be set');
    }
    _client = createStorefrontApiClient({
      storeDomain: domain,
      apiVersion: '2026-01',
      publicAccessToken: token,
    });
  }
  return _client;
}

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
    const { data } = await getClient().request(`
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
    const { data } = await getClient().request(`
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
    freeShippingThreshold: parseFloat(f.gratis_verzending_drempel) || 35,
    shippingCost: parseFloat(f.verzendkosten) || 4.95,
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

const DEFAULT_CATEGORIES: CategoryBlock[] = [
  { name: "Rode Wijn", description: "Krachtig & vol", href: "/wijnen?type=red", iconType: "red", sortOrder: 0 },
  { name: "Witte Wijn", description: "Fris & elegant", href: "/wijnen?type=white", iconType: "white", sortOrder: 1 },
  { name: "Rosé", description: "Zacht & fruitig", href: "/wijnen?type=rose", iconType: "rose", sortOrder: 2 },
  { name: "Mousserende Wijn", description: "Feestelijk & sprankelend", href: "/wijnen?type=sparkling", iconType: "sparkling", sortOrder: 3 },
  { name: "Cadeaus", description: "Het perfecte cadeau", href: "/cadeaus", iconType: "gift", sortOrder: 4 },
];

export async function getCategoryBlocks(): Promise<CategoryBlock[]> {
  const items = await getMetaobjects<CategoryBlock>('category_block', (f) => ({
    name: f.name || '',
    description: f.description || '',
    href: f.href || '/wijnen',
    iconType: f.icon_type || 'red',
    sortOrder: parseInt(f.sort_order || '0'),
  }));
  const sorted = items.sort((a, b) => a.sortOrder - b.sortOrder);
  return sorted.length > 0 ? sorted : DEFAULT_CATEGORIES;
}

// --- Shopify Pages ---

export async function getPage(handle: string): Promise<ShopifyPage | null> {
  try {
    const { data } = await getClient().request(`
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

const BLOG_HANDLE = 'wijn-verhalen';

const ARTICLE_FIELDS = `
  title
  handle
  contentHtml
  excerpt
  publishedAt
  image { url altText }
  tags
  authorV2 { name bio }
  seo { title description }
`;

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function mapArticle(node: Record<string, unknown>): BlogArticle {
  const contentHtml = (node.contentHtml as string) || '';
  const authorV2Raw = node.authorV2 as { name?: string; bio?: string } | null;
  const seoRaw = node.seo as { title?: string; description?: string } | null;
  return {
    title: (node.title as string) || '',
    handle: (node.handle as string) || '',
    contentHtml,
    excerpt: (node.excerpt as string) || '',
    publishedAt: (node.publishedAt as string) || '',
    image: node.image as BlogArticle['image'],
    tags: (node.tags as string[]) || [],
    authorV2: authorV2Raw?.name ? { name: authorV2Raw.name, bio: authorV2Raw.bio || '' } : null,
    seo: { title: seoRaw?.title || null, description: seoRaw?.description || null },
    readingTimeMinutes: estimateReadingTime(contentHtml),
  };
}

export async function getBlogArticles(first: number = 20): Promise<BlogArticle[]> {
  try {
    const { data } = await getClient().request(`
      query getBlogArticles($first: Int!) {
        blog(handle: "${BLOG_HANDLE}") {
          articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
            nodes { ${ARTICLE_FIELDS} }
          }
        }
      }
    `, { variables: { first } });
    const articles = (data?.blog?.articles?.nodes ?? []).map(mapArticle);
    if (articles.length > 0) return articles;
    // Fallback to hardcoded articles when Shopify blog is empty or not yet created
    return DEFAULT_BLOG_ARTICLES.slice(0, first);
  } catch (error) {
    console.error('Failed to fetch blog articles:', error);
    // Fallback to hardcoded articles on error
    return DEFAULT_BLOG_ARTICLES.slice(0, first);
  }
}

export async function getBlogArticlesByTag(tag: string, first: number = 20): Promise<BlogArticle[]> {
  try {
    const { data } = await getClient().request(`
      query getBlogArticlesByTag($first: Int!, $query: String!) {
        blog(handle: "${BLOG_HANDLE}") {
          articles(first: $first, sortKey: PUBLISHED_AT, reverse: true, query: $query) {
            nodes { ${ARTICLE_FIELDS} }
          }
        }
      }
    `, { variables: { first, query: `tag:${tag}` } });
    return (data?.blog?.articles?.nodes ?? []).map(mapArticle);
  } catch (error) {
    console.error(`Failed to fetch articles by tag "${tag}":`, error);
    return [];
  }
}

export async function getBlogArticleByHandle(handle: string): Promise<BlogArticle | null> {
  try {
    const { data } = await getClient().request(`
      query getBlogArticle($blogHandle: String!, $articleHandle: String!) {
        blog(handle: $blogHandle) {
          articleByHandle(handle: $articleHandle) { ${ARTICLE_FIELDS} }
        }
      }
    `, { variables: { blogHandle: BLOG_HANDLE, articleHandle: handle } });
    const node = data?.blog?.articleByHandle;
    if (node) return mapArticle(node);
    // Fallback to hardcoded article
    return DEFAULT_BLOG_ARTICLES.find((a) => a.handle === handle) ?? null;
  } catch (error) {
    console.error(`Failed to fetch article "${handle}":`, error);
    // Fallback to hardcoded article on error
    return DEFAULT_BLOG_ARTICLES.find((a) => a.handle === handle) ?? null;
  }
}

/** Get unique tags from all articles for category filtering */
export async function getBlogTags(): Promise<string[]> {
  const articles = await getBlogArticles(50);
  const tagSet = new Set<string>();
  for (const a of articles) {
    for (const t of a.tags) tagSet.add(t);
  }
  return Array.from(tagSet).sort();
}

// --- Menus ---

export async function getMenu(handle: string): Promise<MenuItem[]> {
  try {
    const { data } = await getClient().request(`
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
  phone: '',
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
  freeShippingThreshold: 35,
  shippingCost: 4.95,
};

export const DEFAULT_HERO: HeroContent = {
  subtitle: 'Kleine producenten, grote wijnen',
  titleLine1: 'Italiaanse wijn',
  titleLine2: 'zonder omwegen',
  description: 'Rechtstreeks van familiewijngaarden in Piemonte, Veneto en Toscane. Persoonlijk geproefd en geïmporteerd door Carla.',
  ctaPrimaryText: 'Bekijk de collectie',
  ctaPrimaryLink: '/wijnen',
  ctaSecondaryText: 'Over Vino per Lei',
  ctaSecondaryLink: '/over-ons',
};

export const DEFAULT_ANNOUNCEMENT: AnnouncementBar = {
  message: 'Welkom! Gebruik code WELKOM10 voor 10% korting op je eerste bestelling',
  enabled: true,
  link: '/wijnen',
};

export const DEFAULT_BLOG_ARTICLES: BlogArticle[] = [
  {
    title: 'Barolo: De Koning der Italiaanse Wijnen',
    handle: 'barolo-de-koning-der-italiaanse-wijnen',
    contentHtml: '<p>Ontdek waarom Barolo uit Piemonte al eeuwenlang de kroon draagt. Van de Nebbiolo-druif tot de kenmerkende tannines — alles over deze iconische wijn.</p>',
    excerpt: 'Ontdek waarom Barolo uit Piemonte al eeuwenlang de kroon draagt. Van de Nebbiolo-druif tot de kenmerkende tannines — alles over deze iconische wijn.',
    publishedAt: '2025-01-15T12:00:00Z',
    image: null,
    tags: ['wijnkennis', 'piemonte'],
    authorV2: { name: 'Carla Daniels', bio: '' },
    seo: { title: 'Barolo: De Koning der Italiaanse Wijnen', description: 'Ontdek waarom Barolo uit Piemonte al eeuwenlang de kroon draagt.' },
    readingTimeMinutes: 5,
  },
  {
    title: 'Toscana: De Ultieme Wijngids',
    handle: 'toscana-de-ultieme-wijngids',
    contentHtml: '<p>Van Chianti Classico tot Brunello di Montalcino — een reis door de wijnheuvels van Toscane. Leer welke wijnen je moet proeven en waarom.</p>',
    excerpt: 'Van Chianti Classico tot Brunello di Montalcino — een reis door de wijnheuvels van Toscane. Leer welke wijnen je moet proeven en waarom.',
    publishedAt: '2025-01-08T12:00:00Z',
    image: null,
    tags: ['regiogids', 'toscana'],
    authorV2: { name: 'Carla Daniels', bio: '' },
    seo: { title: 'Toscana: De Ultieme Wijngids', description: 'Een reis door de wijnheuvels van Toscane.' },
    readingTimeMinutes: 7,
  },
  {
    title: 'Het Geheim van Amarone',
    handle: 'het-geheim-van-amarone',
    contentHtml: '<p>Hoe gedroogde druiven de meest intense wijn van de Veneto creëren. De appassimento-methode uitgelegd voor liefhebbers.</p>',
    excerpt: 'Hoe gedroogde druiven de meest intense wijn van de Veneto creëren. De appassimento-methode uitgelegd voor liefhebbers.',
    publishedAt: '2024-12-20T12:00:00Z',
    image: null,
    tags: ['wijnkennis', 'veneto'],
    authorV2: { name: 'Carla Daniels', bio: '' },
    seo: { title: 'Het Geheim van Amarone', description: 'De appassimento-methode uitgelegd voor liefhebbers.' },
    readingTimeMinutes: 4,
  },
  {
    title: 'Prosecco vs. Champagne: De Verschillen',
    handle: 'prosecco-vs-champagne-de-verschillen',
    contentHtml: '<p>Twee bubbels, twee werelden. Waarom Prosecco uit Valdobbiadene een eigen karakter heeft en wanneer je welke kiest.</p>',
    excerpt: 'Twee bubbels, twee werelden. Waarom Prosecco uit Valdobbiadene een eigen karakter heeft en wanneer je welke kiest.',
    publishedAt: '2024-12-12T12:00:00Z',
    image: null,
    tags: ['tips'],
    authorV2: { name: 'Carla Daniels', bio: '' },
    seo: { title: 'Prosecco vs. Champagne', description: 'Waarom Prosecco uit Valdobbiadene een eigen karakter heeft.' },
    readingTimeMinutes: 3,
  },
  {
    title: 'Piemonte: Meer dan Alleen Barolo',
    handle: 'piemonte-meer-dan-barolo',
    contentHtml: '<p>Barbera, Nebbiolo, Dolcetto — de andere schatten van Piemonte. Een gids voor de veelzijdigste wijnregio van Noord-Italië.</p>',
    excerpt: 'Barbera, Nebbiolo, Dolcetto — de andere schatten van Piemonte. Een gids voor de veelzijdigste wijnregio van Noord-Italië.',
    publishedAt: '2024-12-05T12:00:00Z',
    image: null,
    tags: ['regiogids', 'piemonte'],
    authorV2: { name: 'Carla Daniels', bio: '' },
    seo: { title: 'Piemonte: Meer dan Alleen Barolo', description: 'De andere schatten van Piemonte.' },
    readingTimeMinutes: 6,
  },
  {
    title: 'Wijn & Spijs: De Perfecte Italiaanse Match',
    handle: 'italiaanse-wijn-en-spijs-combinaties',
    contentHtml: '<p>Van Amarone bij ossobuco tot Vermentino bij zeevruchten. De gouden regels van Italiaans combineren.</p>',
    excerpt: 'Van Amarone bij ossobuco tot Vermentino bij zeevruchten. De gouden regels van Italiaans combineren.',
    publishedAt: '2024-11-28T12:00:00Z',
    image: null,
    tags: ['tips'],
    authorV2: { name: 'Carla Daniels', bio: '' },
    seo: { title: 'Wijn & Spijs Combinaties', description: 'De gouden regels van Italiaans combineren.' },
    readingTimeMinutes: 5,
  },
];

// --- Shop Config (shipping settings, CMS-driven with fallbacks) ---

export interface ShopConfig {
  freeShippingThreshold: number;
  shippingCost: number;
}

const DEFAULT_SHOP_CONFIG: ShopConfig = {
  freeShippingThreshold: 35,
  shippingCost: 4.95,
};

export async function getShopConfig(): Promise<ShopConfig> {
  const settings = await getSiteSettings();
  if (!settings) return DEFAULT_SHOP_CONFIG;
  return {
    freeShippingThreshold: settings.freeShippingThreshold,
    shippingCost: settings.shippingCost,
  };
}
