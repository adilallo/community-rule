#!/usr/bin/env node
/**
 * Regenerate root favicon binaries from `public/assets/logos/community-rule.svg`.
 * Safari and iOS need PNG/ICO fallbacks; SVG alone shows a letter fallback in Safari.
 *
 * Cream mark (#FFFDD2) on a transparent canvas — matches the brand SVG.
 *
 * Run: npm run generate:favicons
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const SVG_PATH = path.join(PUBLIC, "assets/logos/community-rule.svg");

async function readLogoSvg() {
  return fs.readFile(SVG_PATH, "utf8");
}

/** Resize the logo SVG to a PNG with alpha (transparent background). */
async function creamMarkTransparent(svg, size) {
  return sharp(Buffer.from(svg))
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function main() {
  const svg = await readLogoSvg();
  const png16 = await creamMarkTransparent(svg, 16);
  const png32 = await creamMarkTransparent(svg, 32);
  const appleTouch = await creamMarkTransparent(svg, 180);
  const faviconIco = await pngToIco([png16, png32]);

  await Promise.all([
    fs.writeFile(path.join(PUBLIC, "favicon-16x16.png"), png16),
    fs.writeFile(path.join(PUBLIC, "favicon-32x32.png"), png32),
    fs.writeFile(path.join(PUBLIC, "apple-touch-icon.png"), appleTouch),
    fs.writeFile(path.join(PUBLIC, "favicon.ico"), faviconIco),
  ]);

  console.log("Wrote public/favicon.ico");
  console.log("Wrote public/favicon-16x16.png");
  console.log("Wrote public/favicon-32x32.png");
  console.log("Wrote public/apple-touch-icon.png");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
