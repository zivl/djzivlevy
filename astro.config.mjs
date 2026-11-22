// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://djzivlevy.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: {
    // emits /epk.html instead of /epk/index.html → clean, slash-less URLs on Vercel
    format: 'file',
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', de: 'de', fr: 'fr', es: 'es', pt: 'pt' },
      },
      // only HTML pages belong in the sitemap (not .md / .txt / .json / .ics endpoints)
      filter: (page) => !/\.(md|txt|json|ics|xml)$/.test(page) && !page.includes('/404'),
      lastmod: new Date(),
    }),
  ],
});
