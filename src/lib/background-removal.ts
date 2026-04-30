import sharp from "sharp";

/**
 * Remove the background from a product image using edge-seeded flood fill.
 *
 * Algorithm:
 * 1. Sample background color from image edges/corners
 * 2. Flood fill from all edge pixels, marking color-similar pixels as background
 * 3. This preserves white/light areas INSIDE the product (labels, text)
 * 4. Apply Gaussian blur to mask edges for smooth anti-aliasing
 * 5. Output PNG with alpha channel
 */
export async function removeBackground(
  imageBuffer: Buffer,
  options: { threshold?: number; feather?: number } = {}
): Promise<Buffer> {
  const { threshold = 30, feather = 1.5 } = options;

  const { data, info } = await sharp(imageBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const totalPixels = width * height;

  // Threshold scaled to RGB euclidean distance (max ~441.67)
  const distThreshold = (threshold / 100) * 441.67;

  // 1. Sample background color from corners (4x4 blocks)
  const bgColor = sampleBackground(data, width, height);

  // 2. Flood fill from edges — BFS with efficient ring buffer
  const mask = new Uint8Array(totalPixels); // 0 = unknown, 1 = background, 2 = foreground
  const queue = new Int32Array(totalPixels); // ring buffer
  let head = 0;
  let tail = 0;

  const enqueue = (idx: number) => {
    if (idx >= 0 && idx < totalPixels && mask[idx] === 0) {
      mask[idx] = 255; // mark as visited (will overwrite below)
      queue[tail++ % totalPixels] = idx;
    }
  };

  // Seed all edge pixels
  for (let x = 0; x < width; x++) {
    enqueue(x); // top
    enqueue((height - 1) * width + x); // bottom
  }
  for (let y = 1; y < height - 1; y++) {
    enqueue(y * width); // left
    enqueue(y * width + width - 1); // right
  }

  // BFS — mark background pixels reachable from edges
  const bgMask = new Uint8Array(totalPixels); // 0 = foreground, 255 = background

  while (head !== tail) {
    const idx = queue[head++ % totalPixels];
    const offset = idx * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];

    const dist = Math.sqrt(
      (r - bgColor.r) ** 2 +
      (g - bgColor.g) ** 2 +
      (b - bgColor.b) ** 2
    );

    if (dist <= distThreshold) {
      bgMask[idx] = 255; // background

      const x = idx % width;
      const y = (idx - x) / width;

      // 4-connected neighbors
      if (x > 0 && mask[idx - 1] === 0) {
        mask[idx - 1] = 1;
        queue[tail++ % totalPixels] = idx - 1;
      }
      if (x < width - 1 && mask[idx + 1] === 0) {
        mask[idx + 1] = 1;
        queue[tail++ % totalPixels] = idx + 1;
      }
      if (y > 0 && mask[idx - width] === 0) {
        mask[idx - width] = 1;
        queue[tail++ % totalPixels] = idx - width;
      }
      if (y < height - 1 && mask[idx + width] === 0) {
        mask[idx + width] = 1;
        queue[tail++ % totalPixels] = idx + width;
      }
    }
  }

  // 3. Feather mask edges with Gaussian blur for anti-aliasing
  const alphaMask = await sharp(Buffer.from(bgMask), {
    raw: { width, height, channels: 1 },
  })
    .blur(feather > 0.3 ? feather : 0.3)
    .raw()
    .toBuffer();

  // 4. Apply mask as alpha channel (invert: bg=0 means transparent)
  const output = Buffer.alloc(totalPixels * 4);

  for (let i = 0; i < totalPixels; i++) {
    const srcOffset = i * 4;
    const dstOffset = i * 4;
    output[dstOffset] = data[srcOffset]; // R
    output[dstOffset + 1] = data[srcOffset + 1]; // G
    output[dstOffset + 2] = data[srcOffset + 2]; // B
    output[dstOffset + 3] = 255 - alphaMask[i]; // invert: bg=transparent
  }

  return sharp(output, {
    raw: { width, height, channels: 4 },
  })
    .png({ compressionLevel: 6, adaptiveFiltering: true })
    .toBuffer();
}

/** Sample background color from corner regions (4x4 blocks at each corner). */
function sampleBackground(
  data: Buffer,
  width: number,
  height: number
): { r: number; g: number; b: number } {
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let count = 0;

  const sampleCorner = (startX: number, startY: number) => {
    for (let dy = 0; dy < 4; dy++) {
      for (let dx = 0; dx < 4; dx++) {
        const x = startX + dx;
        const y = startY + dy;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const offset = (y * width + x) * 4;
          rSum += data[offset];
          gSum += data[offset + 1];
          bSum += data[offset + 2];
          count++;
        }
      }
    }
  };

  sampleCorner(0, 0); // top-left
  sampleCorner(width - 4, 0); // top-right
  sampleCorner(0, height - 4); // bottom-left
  sampleCorner(width - 4, height - 4); // bottom-right

  return {
    r: Math.round(rSum / count),
    g: Math.round(gSum / count),
    b: Math.round(bSum / count),
  };
}
