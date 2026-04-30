import * as ort from "onnxruntime-node";
import sharp from "sharp";

// IS-Net uses 1024x1024, U2Net uses 320x320
const MODEL_INPUT_SIZE = 1024;

let session: ort.InferenceSession | null = null;
let sessionPromise: Promise<ort.InferenceSession> | null = null;

async function getSession(modelPath: string): Promise<ort.InferenceSession> {
  if (session) return session;
  if (sessionPromise) return sessionPromise;

  sessionPromise = ort.InferenceSession.create(modelPath, {
    executionProviders: ["cpu"],
    graphOptimizationLevel: "all",
  }).then((s) => {
    session = s;
    console.log("ONNX session ready", {
      inputs: s.inputNames,
      outputs: s.outputNames,
    });
    return s;
  });

  return sessionPromise;
}

/**
 * Run U2Net segmentation on an image buffer.
 * Returns a transparent PNG with the background removed.
 */
export async function removeBackground(
  imageBuffer: Buffer,
  modelPath: string
): Promise<Buffer> {
  const sess = await getSession(modelPath);

  // Get original dimensions
  const metadata = await sharp(imageBuffer).metadata();
  const origW = metadata.width!;
  const origH = metadata.height!;

  // Resize to model input and convert to raw RGB
  const resized = await sharp(imageBuffer)
    .resize(MODEL_INPUT_SIZE, MODEL_INPUT_SIZE, { fit: "fill", kernel: "lanczos3" })
    .removeAlpha()
    .raw()
    .toBuffer();

  // Convert HWC uint8 → NCHW float32, normalized to [0,1]
  const float32 = new Float32Array(3 * MODEL_INPUT_SIZE * MODEL_INPUT_SIZE);
  for (let y = 0; y < MODEL_INPUT_SIZE; y++) {
    for (let x = 0; x < MODEL_INPUT_SIZE; x++) {
      const src = (y * MODEL_INPUT_SIZE + x) * 3;
      const px = y * MODEL_INPUT_SIZE + x;
      float32[0 * MODEL_INPUT_SIZE * MODEL_INPUT_SIZE + px] = resized[src] / 255;
      float32[1 * MODEL_INPUT_SIZE * MODEL_INPUT_SIZE + px] = resized[src + 1] / 255;
      float32[2 * MODEL_INPUT_SIZE * MODEL_INPUT_SIZE + px] = resized[src + 2] / 255;
    }
  }

  const inputTensor = new ort.Tensor("float32", float32, [
    1, 3, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE,
  ]);

  // Run inference
  const results = await sess.run({ [sess.inputNames[0]]: inputTensor });
  const output = results[sess.outputNames[0]];
  const outputData = output.data as Float32Array;
  const [, , outH, outW] = output.dims as number[];

  // Convert output to mask: sigmoid → threshold → uint8
  const maskData = new Uint8Array(outH * outW);
  for (let i = 0; i < outH * outW; i++) {
    const sigmoid = 1 / (1 + Math.exp(-outputData[i]));
    maskData[i] = Math.round(sigmoid * 255);
  }

  // Resize mask to original dimensions with soft edges
  const mask = await sharp(Buffer.from(maskData), {
    raw: { width: outW, height: outH, channels: 1 },
  })
    .resize(origW, origH, { fit: "fill", kernel: "lanczos3" })
    .blur(1.5) // feather edges
    .raw()
    .toBuffer();

  // Apply mask as alpha channel
  const { data: rgba } = await sharp(imageBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = origW * origH;
  const output4 = Buffer.alloc(pixels * 4);
  for (let i = 0; i < pixels; i++) {
    output4[i * 4] = rgba[i * 4];
    output4[i * 4 + 1] = rgba[i * 4 + 1];
    output4[i * 4 + 2] = rgba[i * 4 + 2];
    output4[i * 4 + 3] = mask[i]; // foreground = opaque
  }

  return sharp(output4, { raw: { width: origW, height: origH, channels: 4 } })
    .png({ compressionLevel: 6, adaptiveFiltering: true })
    .toBuffer();
}
