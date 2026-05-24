#!/usr/bin/env node
/**
 * Regenerate root favicon binaries from `public/assets/logos/community-rule.svg`.
 * Safari and iOS need PNG/ICO fallbacks; SVG alone shows a letter fallback in Safari.
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
const LOGO_FILL = "#FFFDD2";
const MARK_ON_LIGHT = "#000000";

async function readLogoSvg() {
  return fs.readFile(SVG_PATH, "utf8");
}

async function markPng(svg, size, fill) {
  const tinted = svg.replaceAll(LOGO_FILL, fill);
  return sharp(Buffer.from(tinted))
    .resize(size, size, { fit: "contain" })
    .png()
    .toBuffer();
}

async function creamMarkOnBlack(svg, size) {
  const logoSize = Math.round(size * 0.75);
  const logo = await markPng(svg, logoSize, LOGO_FILL);
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();
}

async function main() {
  const svg = await readLogoSvg();
  const png16 = await markPng(svg, 16, MARK_ON_LIGHT);
  const png32 = await markPng(svg, 32, MARK_ON_LIGHT);
  const appleTouch = await creamMarkOnBlack(svg, 180);
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
