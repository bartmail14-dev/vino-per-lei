import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Shopify webhook secret — set in Vercel environment variables
const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

/**
 * On-demand ISR revalidation endpoint.
 * Called by Shopify webhooks when products/collections change.
 *
 * Setup in Shopify Admin → Settings → Notifications → Webhooks:
 *   URL: https://vinoperlei.nl/api/revalidate
 *   Events: Product creation, Product update, Product deletion
 *   Format: JSON
 *
 * Also supports manual revalidation via query param:
 *   POST /api/revalidate?secret=<SHOPIFY_WEBHOOK_SECRET>
 */
export async function POST(request: NextRequest) {
  // Verify the request is authorized
  const secret = request.nextUrl.searchParams.get('secret');
  const shopifyHmac = request.headers.get('x-shopify-hmac-sha256');

  // Accept either query param secret or Shopify HMAC header
  if (!shopifyHmac && secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // If HMAC is present, verify it (Shopify webhook authentication)
  if (shopifyHmac && WEBHOOK_SECRET) {
    const body = await request.text();
    const crypto = await import('crypto');
    const expectedHmac = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(body, 'utf8')
      .digest('base64');

    if (shopifyHmac !== expectedHmac) {
      return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 });
    }
  }

  try {
    // Revalidate all product-related pages
    revalidatePath('/', 'page');           // Homepage (kaart, featured products)
    revalidatePath('/wijnen', 'page');      // Wijnenpagina (filters, grid)
    revalidatePath('/wijnen/[handle]', 'page'); // Alle productpagina's
    revalidatePath('/', 'layout');          // Layout = header mega menu

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      paths: ['/', '/wijnen', '/wijnen/[handle]', 'layout'],
    });
  } catch (error) {
    console.error('[Revalidate] Failed:', error);
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
