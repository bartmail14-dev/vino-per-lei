import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 30;

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || "";

// Uniform canvas: all bottles rendered to this size with padding
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 1200;
const PADDING_PCT = 0.05; // 5% padding on each side

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !url.includes("cdn.shopify.com")) {
    return NextResponse.json(
      { error: "Missing or invalid Shopify image URL" },
      { status: 400 }
    );
  }

  if (!REMOVE_BG_API_KEY) {
    console.error("REMOVE_BG_API_KEY not configured, serving original image");
    return proxyOriginal(url);
  }

  try {
    // Call remove.bg API with image URL
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": REMOVE_BG_API_KEY,
        "Content-Type": "application/json",
        Accept: "image/png",
      },
      body: JSON.stringify({
        image_url: url,
        size: "auto",
        type: "product",
        format: "png",
        channels: "rgba",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`remove.bg API returned ${response.status}: ${errorText}`);
    }

    const rawBuffer = Buffer.from(await response.arrayBuffer());

    // Post-process: trim transparent borders → fit onto uniform canvas
    const normalized = await normalizeBottle(rawBuffer);

    return new NextResponse(new Uint8Array(normalized), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "CDN-Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Background removal failed:", error);
    return proxyOriginal(url);
  }
}

/** Trim transparent borders, then fit bottle onto a uniform canvas */
async function normalizeBottle(input: Buffer): Promise<Buffer> {
  // Trim: remove fully transparent borders
  const trimmed = await sharp(input)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 })
    .toBuffer();

  // Calculate available area (canvas minus padding)
  const padX = Math.round(CANVAS_WIDTH * PADDING_PCT);
  const padY = Math.round(CANVAS_HEIGHT * PADDING_PCT);
  const maxW = CANVAS_WIDTH - padX * 2;
  const maxH = CANVAS_HEIGHT - padY * 2;

  // Resize trimmed bottle to fit within available area, maintaining aspect ratio
  const resized = await sharp(trimmed)
    .resize(maxW, maxH, { fit: "inside", withoutEnlargement: false })
    .toBuffer();

  // Place centered on transparent canvas
  const { width: rw, height: rh } = await sharp(resized).metadata();
  const left = Math.round((CANVAS_WIDTH - (rw || 0)) / 2);
  const top = Math.round((CANVAS_HEIGHT - (rh || 0)) / 2);

  return sharp({
    create: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, left, top }])
    .png()
    .toBuffer();
}

/** Fallback: proxy original image without processing */
async function proxyOriginal(url: string) {
  try {
    const fallback = await fetch(url);
    const fallbackBuffer = Buffer.from(await fallback.arrayBuffer());
    return new NextResponse(new Uint8Array(fallbackBuffer), {
      headers: {
        "Content-Type": fallback.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Image processing failed" },
      { status: 500 }
    );
  }
}
