import type { APIRoute } from 'astro';
import { DEFAULT_TZ, upcomingGigs, type Gig } from '../data/gigs';
import { SITE_URL, profile } from '../data/profile';

// RFC 5545 iCalendar feed of upcoming gigs (subscribe-able in Google/Apple/Outlook).
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** Fold lines longer than 75 octets (RFC 5545 §3.1). */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let current = '';
  for (const ch of line) {
    if (new TextEncoder().encode(current + ch).length > (out.length ? 74 : 75)) {
      out.push(current);
      current = ch;
    } else current += ch;
  }
  out.push(current);
  return out.join('\r\n ');
}

const compact = (date: string) => date.replace(/-/g, '');
const nextDay = (date: string) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function event(g: Gig, stamp: string): string[] {
  const tz = g.timezone ?? DEFAULT_TZ;
  const when = g.time
    ? [`DTSTART;TZID=${tz}:${compact(g.date)}T${g.time.replace(':', '')}00`, 'DURATION:PT4H']
    : [`DTSTART;VALUE=DATE:${compact(g.date)}`, `DTEND;VALUE=DATE:${compact(nextDay(g.date))}`];
  const location = [g.venue, g.address, g.city, g.country].filter(Boolean).join(', ');
  return [
    'BEGIN:VEVENT',
    `UID:${g.date}-${slug(g.venue)}@djzivlevy.com`,
    `DTSTAMP:${stamp}`,
    ...when,
    `SUMMARY:${esc(g.eventName ? `${g.eventName} – ${profile.name}` : `${profile.name} at ${g.venue}`)}`,
    `LOCATION:${esc(location)}`,
    `URL:${g.ticketUrl ?? `${SITE_URL}/epk#gigs`}`,
    `DESCRIPTION:${esc(`${profile.name} live.${g.ticketUrl ? ` Tickets: ${g.ticketUrl}` : ''}`)}`,
    'END:VEVENT',
  ];
}

export const GET: APIRoute = () => {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//djzivlevy.com//Gigs//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${profile.name} – Gigs`,
    `X-WR-TIMEZONE:${DEFAULT_TZ}`,
    ...upcomingGigs().flatMap((g) => event(g, stamp)),
    'END:VCALENDAR',
  ];
  return new Response(lines.map(fold).join('\r\n') + '\r\n', { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
