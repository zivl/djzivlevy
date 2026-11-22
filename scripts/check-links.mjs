// Checks every external link in the built site (run `npm run build` first).
// Usage: npm run check:links
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
// Hosts that block bots or require a session; checked manually instead.
const SKIP = [/^https:\/\/(www\.)?instagram\.com/, /^https:\/\/ig\.me\//, /^https:\/\/(www\.)?facebook\.com/, /^https:\/\/api\.whatsapp\.com/, /^https:\/\/tidal\.com\//];

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(p);
    else if (/\.(html|md|txt|json|ics)$/.test(entry.name)) yield p;
  }
}

const urls = new Map();
for await (const file of files(DIST)) {
  // ignore inline JS (analytics bundles contain URL fragments, not links), but keep JSON-LD
  const text = (await readFile(file, 'utf8')).replace(/<script(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, '');
  for (const [, url] of text.matchAll(/(https?:\/\/[^\s"'<>)\]]+)/g)) {
    if (url.startsWith('https://djzivlevy.com') || url.startsWith('http://www.w3.org') || url.includes('schema.org')) continue;
    if (!urls.has(url)) urls.set(url, file.replace(DIST, ''));
  }
}

let failed = 0;
const results = await Promise.all(
  [...urls.keys()].map(async (url) => {
    if (SKIP.some((re) => re.test(url))) return { url, status: 'skipped' };
    try {
      let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) });
      if (res.status >= 400) res = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15000) });
      return { url, status: res.status };
    } catch (error) {
      return { url, status: `error: ${error.message}` };
    }
  }),
);
for (const { url, status } of results.sort((a, b) => a.url.localeCompare(b.url))) {
  const ok = status === 'skipped' || (typeof status === 'number' && status < 400);
  if (!ok) failed += 1;
  console.log(`${ok ? '✓' : '✗'} ${status}\t${url}${ok ? '' : `  (in ${urls.get(url)})`}`);
}
console.log(`\n${results.length} unique external URLs, ${failed} failing`);
process.exit(failed ? 1 : 0);
