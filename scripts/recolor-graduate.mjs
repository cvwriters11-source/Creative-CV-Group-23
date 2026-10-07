import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = "public/templates";
const colors = {
  blue: [30, 107, 184],
  chrome: [138, 146, 156],
  "dark-grey": [75, 81, 88],
  "navy-blue": [27, 54, 93],
  "dark-green": [26, 74, 56],
  teal: [0, 152, 153],
};

function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : d / max, max];
}

function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function isTealAccent(r, g, b) {
  const [h, s, v] = rgbToHsv(r, g, b);
  return s > 0.22 && v > 0.18 && h >= 155 && h <= 205;
}

async function recolor(srcPage, dest, target, protectPhoto) {
  const { data, info } = await sharp(srcPage).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const [th, ts] = rgbToHsv(...target);
  const photo = protectPhoto
    ? { x0: Math.floor(width * 0.05), x1: Math.floor(width * 0.34), y0: Math.floor(height * 0.12), y1: Math.floor(height * 0.34) }
    : null;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (photo && x >= photo.x0 && x <= photo.x1 && y >= photo.y0 && y <= photo.y1 && !isTealAccent(r, g, b)) {
        continue;
      }
      if (!isTealAccent(r, g, b)) continue;
      const [, , v] = rgbToHsv(r, g, b);
      const [nr, ng, nb] = hsvToRgb(th, ts, v);
      data[i] = nr;
      data[i + 1] = ng;
      data[i + 2] = nb;
    }
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(dest);
  console.log("wrote", dest);
}

const pages = [
  ["international-resume_page_1.png", false],
  ["international-resume_page_2.png", false],
];

for (const [file, protectPhoto] of pages) {
  const src = path.join(root, file);
  const page = file.match(/page_(\d+)/)?.[1] ?? "1";
  for (const [name, rgb] of Object.entries(colors)) {
    const dest = path.join(root, `international-resume_page_${page}_${name}.png`);
    if (name === "teal") {
      fs.copyFileSync(src, dest);
      console.log("copied", dest);
      continue;
    }
    await recolor(src, dest, rgb, protectPhoto);
  }
}
