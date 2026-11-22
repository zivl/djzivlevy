import type { APIRoute } from 'astro';
import terms from '../../terms_and_conditions.md?raw';

export const GET: APIRoute = () => new Response(terms, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
