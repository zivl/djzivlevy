import type { APIRoute } from 'astro';
import { localeStaticPaths, type Locale } from '../../i18n/utils';
import { epkMarkdown } from '../../lib/markdown';

export const getStaticPaths = localeStaticPaths;

export const GET: APIRoute<{ lang: Locale }> = ({ props }) =>
  new Response(epkMarkdown(props.lang), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
