import type { APIRoute } from 'astro';
import statement from '../../ACCESSIBILITY_STATEMENT.md?raw';

export const GET: APIRoute = () => new Response(statement, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
