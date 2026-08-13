import sharp from "sharp";

const SRC = "/tmp/fiy-logo.jpeg";
const OUT = "/vercel/share/v0-project/public/images/brand/fiy-logo.png";

const img = sharp(SRC).ensureAlpha();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const idx = (x, y) => (y * width + x) * channels;
const isWhite = (i) => data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235;

// Flood fill from all border pixels; only clears white regions connected to the edge.
const visited = new Uint8Array(width * height);
const stack = [];
for (let x = 0; x < width; x++) {
  stack.push([x, 0], [x, height - 1]);
}
for (let y = 0; y < height; y++) {
  stack.push([0, y], [width - 1, y]);
}

while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= width || y >= height) continue;
  const p = y * width + x;
  if (visited[p]) continue;
  const i = idx(x, y);
  if (!isWhite(i)) continue;
  visited[p] = 1;
  data[i + 3] = 0; // transparent
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

// Compute bounding box of remaining (non-transparent) pixels to trim padding.
let minX = width, minY = height, maxX = 0, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (data[idx(x, y) + 3] > 0) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const cropW = maxX - minX + 1;
const cropH = maxY - minY + 1;

await sharp(data, { raw: { width, height, channels } })
  .extract({ left: minX, top: minY, width: cropW, height: cropH })
  .png()
  .toFile(OUT);

console.log(`[v0] Saved ${OUT} (${cropW}x${cropH})`);
