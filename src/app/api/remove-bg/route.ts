import { NextRequest, NextResponse } from "next/server";
import { removeBackground } from "@/lib/background-removal";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !url.includes("cdn.shopify.com")) {
    return NextResponse.json(
      { error: "Missing or invalid Shopify image URL" },
      { status: 400 }
    );
  }

  try {
    // Fetch original image from Shopify CDN
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image from Shopify" },
        { status: 502 }
      );
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Remove background
    const processedBuffer = await removeBackground(imageBuffer);

    // Return processed PNG with aggressive caching (1 year)
    return new NextResponse(new Uint8Array(processedBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "CDN-Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Background removal failed:", error);

    // Fallback: proxy original image without processing
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
}
