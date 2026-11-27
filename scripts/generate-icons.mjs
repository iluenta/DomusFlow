import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const iconsDir = path.join(root, "public", "icons");
const source = path.join(root, "public", "brand", "icon.svg");
const maskableSource = path.join(root, "public", "brand", "icon-maskable.svg");

await mkdir(iconsDir, { recursive: true });

const jobs = [
  { input: source, output: "icon-192.png", size: 192 },
  { input: source, output: "icon-512.png", size: 512 },
  { input: maskableSource, output: "icon-maskable-512.png", size: 512 },
  { input: source, output: "apple-touch-icon.png", size: 180 },
];

for (const job of jobs) {
  await sharp(job.input)
    .resize(job.size, job.size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(iconsDir, job.output));
  console.log(`✓ ${job.output}`);
}
