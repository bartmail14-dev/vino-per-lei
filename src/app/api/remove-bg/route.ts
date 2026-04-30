import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const WORKER_URL = process.env.BG_WORKER_URL || "https://unique-light-production-8e88.up.railway.app";
const WORKER_KEY = process.env.BG_WORKER_KEY || "";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !url.includes("cdn.shopify.com")) {
    return NextResponse.json(
      { error: "Missing or invalid Shopify image URL" },
      { status: 400 }
    );
  }

  try {
    // Proxy to Railway ONNX worker
    const workerUrl = `${WORKER_URL}/remove-bg?url=${encodeURIComponent(url)}`;
    const headers: Record<string, string> = {};
    if (WORKER_KEY) headers["x-api-key"] = WORKER_KEY;

    const response = await fetch(workerUrl, { headers });

    if (!response.ok) {
      throw new Error(`Worker returned ${response.status}`);
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
