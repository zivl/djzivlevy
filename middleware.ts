// Vercel Routing Middleware (runs at the edge, framework-agnostic).
// Content negotiation for AI agents: a request for a page that sends
// `Accept: text/markdown` gets that page's Markdown twin instead of HTML.
// Static files win over vercel.json rewrites, so this has to be middleware.
import { next, rewrite } from '@vercel/functions';

export const config = {
  matcher: ['/', '/epk', '/terms', '/privacy', '/(de|fr|es|pt)', '/(de|fr|es|pt)/epk'],
};

export function markdownPathFor(pathname: string): string {
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/') return '/index.md';
  // locale home pages (/de, /fr …) have their twin at /de/index.md
  if (/^\/(de|fr|es|pt)$/.test(path)) return `${path}/index.md`;
  return `${path}.md`;
}

export default function middleware(request: Request): Response {
  const accept = request.headers.get('accept') ?? '';
  if (!/\btext\/markdown\b/i.test(accept)) {
    return next({ headers: { Vary: 'Accept' } });
  }
  const url = new URL(request.url);
  url.pathname = markdownPathFor(url.pathname);
  return rewrite(url, { headers: { Vary: 'Accept' } });
}
