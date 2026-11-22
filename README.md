# djzivlevy.com

The official website of DJ Ziv Levy: a link-in-bio page and an electronic press kit (EPK) in five languages, built for search engines and AI agents as well as people.

- **Stack:** [Astro](https://astro.build) (static output), hosted on Vercel, with Vercel Web Analytics (cookieless).
- **Languages:** English (`/`), German (`/de`), French (`/fr`), Spanish (`/es`), Portuguese (`/pt`).
- **Pages:** `/` links, `/epk` press kit, `/terms`, `/privacy`.

## Develop

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # type-check (astro check) + build to dist/
npm run preview      # serve dist/
npm run check:links  # after a build: verify every external link
```

Requires Node 24.

## Editing content

All content is data. Edit a file, push, and Vercel redeploys every page, Markdown twin, JSON feed and structured-data block from it.

| What | Where |
| --- | --- |
| Name, genres, location, WhatsApp, Instagram, email | `src/data/profile.ts` |
| Social icons | `src/data/socials.ts` |
| Spotify / Apple Music / **TIDAL** / YouTube links | `src/data/music.ts` |
| DJ sets (YouTube) | `src/data/videos.ts` + a thumbnail in `src/assets/videos/<id>.jpg` |
| **Gigs** | `src/data/gigs.ts` (past gigs drop off automatically) |
| Tech rider | `src/data/rider.ts` (labels in `src/i18n/*.ts`) |
| Gallery and press photos | `src/assets/gallery/` + `src/data/gallery.ts` |
| Logos | `public/press/logos/` |
| All text: bio, FAQ, headings, SEO titles and descriptions | `src/i18n/en.ts` (source), `de.ts`, `fr.ts`, `es.ts`, `pt.ts` |
| Terms / Privacy | `terms_and_conditions.md`, `PRIVACY_NOTICE.md` (rendered at `/terms`, `/privacy`) |

The translations must have exactly the same keys as `en.ts`; a missing key fails the build.
After changing the hero images or logo, run `node scripts/make-assets.mjs` to regenerate the social-share cards (`public/og/`) and favicons.

**Adding a YouTube set:** add an entry to `videos.ts` (id, title, upload date, length in seconds; `featured: true` also shows it on the EPK). Then save the thumbnail:

```bash
curl -o src/assets/videos/<id>.jpg https://i.ytimg.com/vi/<id>/hqdefault.jpg
```

**Gigs auto-refresh:** past gigs are hidden in the browser as soon as their date passes. Structured data and the iCal feed update on the next deploy. To refresh them daily without pushing, add a Vercel Deploy Hook and call it from a scheduled job.

## SEO

- One canonical host, `https://djzivlevy.com`. `www.` and `iam.` 308-redirect to it with the path kept (`vercel.json`), so old `iam.djzivlevy.com/epk` links still work.
- Each page in each language has a unique title and description, a self-referencing canonical, `hreflang` links for all 5 languages plus `x-default`, Open Graph/Twitter cards and a sitemap with alternates (`/sitemap-index.xml`).
- JSON-LD `@graph` per page: `WebSite`, `ProfilePage`/`WebPage`, `MusicGroup`+`Person` (with `sameAs` to every profile), `VideoObject` for each set, `MusicEvent` for upcoming gigs, `FAQPage` and `BreadcrumbList` on the EPK. Builders are in `src/lib/jsonld.ts`.
- Performance: static HTML, self-hosted fonts, AVIF/WebP responsive images, and YouTube and Spotify players behind click-to-load previews, so no third-party JS runs on page load.

## AI-ready layer

| URL | What |
| --- | --- |
| `/llms.txt` | [llms.txt](https://llmstxt.org) index: summary, pages, data, languages |
| `/llms-full.txt` | Whole site as one Markdown file |
| `/index.md`, `/epk.md`, `/de/epk.md` … | Markdown twin of every page (also advertised via `<link rel="alternate" type="text/markdown">`) |
| `Accept: text/markdown` | Any page URL returns its Markdown twin (`middleware.ts`, Vercel Routing Middleware) |
| `/artist.json` | Machine-readable artist profile (genres, links, booking, rider, press assets) |
| `/gigs.json`, `/gigs.ics` | Gigs as JSON and as a subscribable calendar |
| `/robots.txt` | Allows all crawlers, AI search and training bots included |

## Launch checklist (moving off Wix)

1. **Vercel:** import this GitHub repo (Astro is detected automatically) and check the `*.vercel.app` preview. Then go to Project → Analytics and enable **Web Analytics**.
2. **Vercel → Settings → Domains:** add `djzivlevy.com`, `www.djzivlevy.com` and `iam.djzivlevy.com`.
3. **Wix → Domains → djzivlevy.com:**
   - Disconnect the domain from the Wix site. It stays registered at Wix.
   - Open **Manage DNS records** and set the records exactly as Vercel shows them: apex `A` record, plus `CNAME` for `www` and `iam`.
   - Remove the old Wix A/CNAME records.
4. Wait for Vercel to show all three domains as valid with SSL issued. Then check:

   ```bash
   curl -sI https://djzivlevy.com | head -1                 # 200
   curl -sI https://iam.djzivlevy.com/epk | grep -i location  # https://djzivlevy.com/epk
   curl -s -H "Accept: text/markdown" https://djzivlevy.com/epk | head -3
   ```

5. **Search engines:**
   - [Google Search Console](https://search.google.com/search-console): add a *Domain* property, verify with the TXT record in Wix DNS, and submit `https://djzivlevy.com/sitemap-index.xml`.
   - [Bing Webmaster Tools](https://www.bing.com/webmasters): import from Search Console. Bing also powers ChatGPT search and Copilot.
   - Run `npm run build && npm run indexnow` to ping IndexNow. The key file is in `public/`.
6. **Validate:**
   - [Rich Results Test](https://search.google.com/test/rich-results) and [validator.schema.org](https://validator.schema.org) on `/` and `/epk`.
   - Lighthouse on mobile.
   - Paste the link into WhatsApp to see the preview card.
7. **Profiles:** point the Instagram, YouTube, Facebook, Spotify for Artists, Apple Music for Artists and TIDAL bios to `https://djzivlevy.com`.
8. After about a week of stable traffic, **cancel the Wix Premium plan**. Keep the **domain auto-renew ON** at Wix (it expires 2027-06-16), or transfer the domain to Vercel before then.

## Off-site SEO (recommended)

- **Google Business Profile:** create it as a service-area business (DJ, Israel). This is the biggest local-search win.
- Claim or create profiles on **Resident Advisor**, **SoundCloud** / **Mixcloud** and **MusicBrainz**, all linking to djzivlevy.com, with the same name and bio everywhere.
- Baseline now and re-check monthly: search Google and ask ChatGPT, Claude and Perplexity "Who is DJ Ziv Levy?".
