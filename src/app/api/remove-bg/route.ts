import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 30;

// Uniform canvas: all bottles rendered to this size with padding
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 1200;
const PADDING_PCT = 0.05; // 5% padding on each side

// Flood-fill tolerance: how "white" a pixel needs to be to count as background
const BG_TOLERANCE = 35; // 0-255, higher = more aggressive removal
const EDGE_FEATHER = 2; // pixels of anti-alias softening at edges

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !url.includes("cdn.shopify.com")) {
    return NextResponse.json(
      { error: "Missing or invalid Shopify image URL" },
      { status: 400 }
    );
  }

  try {
    // Fetch the original image
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Remove background using flood-fill from corners
    const processed = await removeBackground(imageBuffer);

    // Normalize onto uniform canvas
    const normalized = await normalizeBottle(processed);

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

/**
 * Remove background using flood-fill from all 4 corners.
 * Works well for product images with white/light uniform backgrounds.
 */
async function removeBackground(input: Buffer): Promise<Buffer> {
  // Convert to raw RGBA pixels
  const image = sharp(input).ensureAlpha();
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = new Uint8Array(data.buffer, data.byteOffset, data.length);

  // Track which pixels are "background" via flood-fill
  const visited = new Uint8Array(width * height);

  // Sample background color from corners (average of corner pixels)
  const bgColor = sampleBackgroundColor(pixels, width, height, channels);

  // Flood-fill from all 4 corners
  const seeds = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    // Also seed from edge midpoints for better coverage
    [Math.floor(width / 2), 0],
    [Math.floor(width / 2), height - 1],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
  ];

  for (const [sx, sy] of seeds) {
    floodFill(pixels, visited, width, height, channels, sx, sy, bgColor, BG_TOLERANCE);
  }

  // Make background pixels transparent, with edge feathering
  applyTransparency(pixels, visited, width, height, channels, EDGE_FEATHER);

  // Convert back to PNG via sharp
  return sharp(Buffer.from(pixels.buffer), {
    raw: { width, height, channels: channels as 4 },
  })
    .png()
    .toBuffer();
}

/** Sample background color by averaging corner regions (8x8 blocks) */
function sampleBackgroundColor(
  pixels: Uint8Array,
  width: number,
  height: number,
  channels: number
): [number, number, number] {
  let r = 0, g = 0, b = 0, count = 0;
  const sampleSize = 8;

  const corners = [
    [0, 0],
    [width - sampleSize, 0],
    [0, height - sampleSize],
    [width - sampleSize, height - sampleSize],
  ];

  for (const [cx, cy] of corners) {
    for (let dy = 0; dy < sampleSize; dy++) {
      for (let dx = 0; dx < sampleSize; dx++) {
        const x = Math.max(0, Math.min(width - 1, cx + dx));
        const y = Math.max(0, Math.min(height - 1, cy + dy));
        const idx = (y * width + x) * channels;
        r += pixels[idx];
        g += pixels[idx + 1];
        b += pixels[idx + 2];
        count++;
      }
    }
  }

  return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
}

/** Flood-fill using a queue (BFS) — marks matching pixels in visited array */
function floodFill(
  pixels: Uint8Array,
  visited: Uint8Array,
  width: number,
  height: number,
  channels: number,
  startX: number,
  startY: number,
  bgColor: [number, number, number],
  tolerance: number
) {
  const queue: number[] = [startX, startY];
  const idx0 = startY * width + startX;
  if (visited[idx0]) return;

  // Check if seed pixel matches background
  const seedIdx = idx0 * channels;
  if (!isBackground(pixels, seedIdx, bgColor, tolerance)) return;

  visited[idx0] = 1;

  while (queue.length > 0) {
    const y = queue.pop()!;
    const x = queue.pop()!;

    // Check 4 neighbors
    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const nIdx = ny * width + nx;
      if (visited[nIdx]) continue;

      const pixelIdx = nIdx * channels;
      if (isBackground(pixels, pixelIdx, bgColor, tolerance)) {
        visited[nIdx] = 1;
        queue.push(nx, ny);
      }
    }
  }
}

/** Check if pixel at given index is close to the background color */
function isBackground(
  pixels: Uint8Array,
  idx: number,
  bgColor: [number, number, number],
  tolerance: number
): boolean {
  const dr = Math.abs(pixels[idx] - bgColor[0]);
  const dg = Math.abs(pixels[idx + 1] - bgColor[1]);
  const db = Math.abs(pixels[idx + 2] - bgColor[2]);
  return dr <= tolerance && dg <= tolerance && db <= tolerance;
}

/** Make background pixels transparent with edge feathering for smooth edges */
function applyTransparency(
  pixels: Uint8Array,
  visited: Uint8Array,
  width: number,
  height: number,
  channels: number,
  featherRadius: number
) {
  // First pass: set background pixels to transparent
  for (let i = 0; i < width * height; i++) {
    if (visited[i]) {
      pixels[i * channels + 3] = 0; // Set alpha to 0
    }
  }

  // Second pass: feather edges for anti-aliasing
  if (featherRadius <= 0) return;

  // Find edge pixels (foreground pixels adjacent to background)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (visited[idx]) continue; // Skip background

      // Check if this foreground pixel is near the edge
      let minDist = featherRadius + 1;
      for (let dy = -featherRadius; dy <= featherRadius; dy++) {
        for (let dx = -featherRadius; dx <= featherRadius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          if (visited[ny * width + nx]) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) minDist = dist;
          }
        }
      }

      if (minDist <= featherRadius) {
        // Blend alpha based on distance to background
        const alpha = Math.round((minDist / featherRadius) * 255);
        const pixelIdx = idx * channels;
        pixels[pixelIdx + 3] = Math.min(pixels[pixelIdx + 3], alpha);
      }
    }
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
        "Cache-Control": "public, max-age=300", // Short cache for fallback
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Image processing failed" },
      { status: 500 }
    );
  }
}
