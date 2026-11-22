import type { APIRoute } from 'astro';
import privacy from '../../PRIVACY_NOTICE.md?raw';

export const GET: APIRoute = () => new Response(privacy, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
