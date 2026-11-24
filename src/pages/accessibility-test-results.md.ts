import type { APIRoute } from 'astro';
import results from '../../ACCESSIBILITY_TEST_RESULTS.md?raw';
import screenshot from '../assets/accessibility/achecker-results.png';
import { absoluteUrl } from '../i18n/utils';

// the source file points at the image in the repo; the published Markdown needs its public URL
const body = results.replace('./src/assets/accessibility/achecker-results.png', absoluteUrl(screenshot.src));

export const GET: APIRoute = () => new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
