// Tells Bing, Yandex, Seznam, Naver (and through Bing, ChatGPT search / Copilot)
// that the site's pages changed. Run after a production deploy:  npm run indexnow
import { readFile } from 'node:fs/promises';

const HOST = 'djzivlevy.com';
const KEY = '336a15cc7f3df9e030e2533bed8359c2'; // must match public/336a15cc7f3df9e030e2533bed8359c2.txt
const sitemap = await readFile(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
process.exit(res.ok ? 0 : 1);
