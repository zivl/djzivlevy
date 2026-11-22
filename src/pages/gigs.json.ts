import type { APIRoute } from 'astro';
import { DEFAULT_TZ, gigStartIso, pastGigs, upcomingGigs, type Gig } from '../data/gigs';
import { profile } from '../data/profile';

const shape = (g: Gig) => ({
  name: g.eventName ?? `${profile.name} at ${g.venue}`,
  start: gigStartIso(g),
  timezone: g.timezone ?? DEFAULT_TZ,
  venue: g.venue,
  address: g.address ?? null,
  city: g.city,
  country: g.country,
  tickets: g.ticketUrl ?? null,
});

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({ artist: profile.name, generated: new Date().toISOString(), upcoming: upcomingGigs().map(shape), recent: pastGigs().map(shape) }, null, 2),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
