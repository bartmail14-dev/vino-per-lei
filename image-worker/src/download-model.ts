import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";

const MODEL_DIR = "models";
const MODEL_PATH = `${MODEL_DIR}/isnet-general-use.onnx`;

// IS-Net (DIS5K) — ~176MB, high quality dichotomous image segmentation
const MODEL_URL =
  "https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx";

async function downloadModel() {
  if (existsSync(MODEL_PATH)) {
    console.log(`Model already exists at ${MODEL_PATH}`);
    return;
  }

  console.log(`Downloading U2Net model from ${MODEL_URL}...`);
  mkdirSync(MODEL_DIR, { recursive: true });

  const response = await fetch(MODEL_URL);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download model: ${response.status}`);
  }

  const fileStream = createWriteStream(MODEL_PATH);
  await pipeline(Readable.fromWeb(response.body as NodeReadableStream<Uint8Array>), fileStream);

  console.log(`Model downloaded to ${MODEL_PATH}`);
}

downloadModel().catch((err) => {
  console.error("Failed to download model:", err);
  process.exit(1);
});
