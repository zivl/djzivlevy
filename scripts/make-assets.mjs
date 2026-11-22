// One-off generator for social cards, favicons and the JSON-LD portrait.
// Run after changing the hero images or logo:  node scripts/make-assets.mjs
// Uses sharp (installed with Astro). Text is rendered by librsvg with system fonts.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const BG = '#05001e';
const out = (p) => new URL(`../public/${p}`, import.meta.url);
const src = (p) => new URL(`../${p}`, import.meta.url);
await mkdir(out('og'), { recursive: true });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function overlay({ eyebrow, title, subtitle, footer }) {
  return Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${BG}" stop-opacity="0.96"/>
      <stop offset="0.55" stop-color="${BG}" stop-opacity="0.75"/>
      <stop offset="1" stop-color="${BG}" stop-opacity="0.1"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ff2e6e"/><stop offset="1" stop-color="#a52bff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <rect x="80" y="150" width="96" height="6" rx="3" fill="url(#accent)"/>
  <g font-family="Montserrat, 'Helvetica Neue', Helvetica, Arial, sans-serif" fill="#fff">
    <text x="80" y="128" font-size="26" font-weight="700" letter-spacing="5" fill="#ff2e6e">${esc(eyebrow)}</text>
    <text x="78" y="270" font-size="104" font-weight="800" letter-spacing="-2">${esc(title)}</text>
    <text x="80" y="340" font-size="34" font-weight="500" fill="#d9d3f5">${esc(subtitle)}</text>
    <text x="80" y="560" font-size="28" font-weight="700" fill="#ffffff" opacity="0.9">${esc(footer)}</text>
  </g>
</svg>`);
}

async function card(input, file, text, position = 'centre') {
  const base = await sharp(await readFile(src(input))).resize(1200, 630, { fit: 'cover', position }).toBuffer();
  const logo = await sharp(await readFile(out('press/logos/djzivlevy-logo-white.png'))).resize(150, 150).toBuffer();
  await sharp(base)
    .composite([
      { input: overlay(text), top: 0, left: 0 },
      { input: logo, top: 440, left: 980 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out(file).pathname);
  console.log('wrote', file);
}

await card('src/assets/hero-crowd.jpg', 'og/home.jpg', {
  eyebrow: 'TEL AVIV DJ',
  title: 'DJ ZIV LEVY',
  subtitle: 'Techno · Dark 80s · EBM · Synthwave',
  footer: 'djzivlevy.com',
});
await card('src/assets/hero-booth.jpg', 'og/epk.jpg', {
  eyebrow: 'PRESS KIT',
  title: 'DJ ZIV LEVY',
  subtitle: 'Bio · Mixes · Tech rider · Booking',
  footer: 'djzivlevy.com/epk',
});

// Square portrait for structured data (focal point matches the Wix crop).
const avatar = sharp(await readFile(src('src/assets/avatar.jpg')));
const { width = 896, height = 1195 } = await avatar.metadata();
const side = Math.min(width, height);
const left = Math.round(Math.min(Math.max(width * 0.39 - side / 2, 0), width - side));
const top = Math.round(Math.min(Math.max(height * 0.31 - side / 2, 0), height - side));
await avatar.extract({ left, top, width: side, height: side }).resize(800, 800).jpeg({ quality: 85, mozjpeg: true }).toFile(out('og/portrait.jpg').pathname);
console.log('wrote og/portrait.jpg');

// Favicons: white cat logo on the brand background.
async function icon(size, pad = 0.14, radius = 0.22) {
  const inner = Math.round(size * (1 - pad * 2));
  const logo = await sharp(await readFile(out('press/logos/djzivlevy-logo-white.png'))).trim().resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const r = Math.round(size * radius);
  const bg = Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" rx="${r}" fill="${BG}"/></svg>`);
  return sharp(bg).composite([{ input: logo, gravity: 'centre' }]).png().toBuffer();
}

await writeFile(out('favicon-48.png'), await icon(48));
await writeFile(out('apple-touch-icon.png'), await icon(180, 0.14, 0));
await writeFile(out('icon-192.png'), await icon(192));
await writeFile(out('icon-512.png'), await icon(512));
// maskable icon: full-bleed background, logo inside the safe zone
await writeFile(out('icon-maskable-512.png'), await icon(512, 0.24, 0));

// favicon.ico with an embedded 32px PNG (valid ICO since Windows Vista).
const png32 = await icon(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // count
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt8(0, 8); // palette
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // planes
header.writeUInt16LE(32, 12); // bpp
header.writeUInt32LE(png32.length, 14); // size
header.writeUInt32LE(22, 18); // offset
await writeFile(out('favicon.ico'), Buffer.concat([header, png32]));
console.log('wrote favicons');
