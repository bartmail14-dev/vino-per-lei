import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || "";

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

    const buffer = Buffer.from(await response.arrayBuffer());

    return new NextResponse(new Uint8Array(buffer), {
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
