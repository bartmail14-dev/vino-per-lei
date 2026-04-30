import express from "express";
import { removeBackground } from "./segmentation.js";
import { existsSync } from "node:fs";

const PORT = parseInt(process.env.PORT || "3100", 10);
const MODEL_PATH = process.env.MODEL_PATH || "models/isnet-general-use.onnx";
const API_KEY = process.env.API_KEY || "";

const app = express();

// Simple API key auth
function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!API_KEY) return next(); // no key configured = open
  const key = req.headers["x-api-key"] || req.query["key"];
  if (key === API_KEY) return next();
  res.status(401).json({ error: "Unauthorized" });
}

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    model: existsSync(MODEL_PATH) ? "loaded" : "missing",
    timestamp: new Date().toISOString(),
  });
});

app.get("/remove-bg", auth, async (req, res) => {
  const url = req.query.url as string | undefined;

  if (!url || !url.includes("cdn.shopify.com")) {
    res.status(400).json({ error: "Missing or invalid Shopify CDN URL" });
    return;
  }

  try {
    console.log(`Processing: ${url.substring(0, 80)}...`);
    const start = Date.now();

    // Fetch image from Shopify CDN
    const imageRes = await fetch(url);
    if (!imageRes.ok) {
      res.status(502).json({ error: "Failed to fetch image from Shopify" });
      return;
    }
    const imageBuffer = Buffer.from(await imageRes.arrayBuffer());

    // Run ONNX segmentation
    const result = await removeBackground(imageBuffer, MODEL_PATH);

    const duration = Date.now() - start;
    console.log(`Done in ${duration}ms (${(result.length / 1024).toFixed(0)}KB)`);

    res
      .set({
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "CDN-Cache-Control": "public, max-age=31536000, immutable",
        "X-Processing-Time": `${duration}ms`,
      })
      .send(result);
  } catch (error) {
    console.error("Processing failed:", error);

    // Fallback: proxy original image
    try {
      const fallback = await fetch(url);
      const buf = Buffer.from(await fallback.arrayBuffer());
      res
        .set({
          "Content-Type": fallback.headers.get("Content-Type") || "image/jpeg",
          "Cache-Control": "public, max-age=3600",
        })
        .send(buf);
    } catch {
      res.status(500).json({ error: "Image processing failed" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Image worker listening on port ${PORT}`);
  console.log(`Model path: ${MODEL_PATH}`);
  console.log(`API key: ${API_KEY ? "configured" : "disabled (open access)"}`);

  if (!existsSync(MODEL_PATH)) {
    console.warn("WARNING: Model file not found! Run: npm run download-model");
  }
});
