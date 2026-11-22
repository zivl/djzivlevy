// Add gigs here — upcoming ones appear on the site, in /gigs.ics, /gigs.json and as
// MusicEvent structured data. Past gigs stay listed under "Recent gigs" in the press kit.
//
// Example:
// {
//   date: '2026-12-31',
//   time: '23:00',                      // optional, local time at the venue
//   timezone: 'Asia/Jerusalem',         // optional, defaults to Asia/Jerusalem
//   eventName: 'New Year Dark Rave',    // optional
//   venue: 'The Block',
//   address: '157 Salame St',           // optional, improves Google event results
//   city: 'Tel Aviv',
//   country: 'IL',                      // ISO 3166-1 alpha-2
//   ticketUrl: 'https://…',             // optional
// },

export interface Gig {
  date: string;
  time?: string;
  timezone?: string;
  eventName?: string;
  venue: string;
  address?: string;
  city: string;
  country: string;
  ticketUrl?: string;
}

export const gigs: Gig[] = [
  // TODO(Ziv): add your upcoming and recent gigs
];

export const DEFAULT_TZ = 'Asia/Jerusalem';

const byDate = (a: Gig, b: Gig) => a.date.localeCompare(b.date);

/** YYYY-MM-DD for "today" in Israel, evaluated at build time. */
export function todayIso(tz = DEFAULT_TZ): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export const upcomingGigs = (): Gig[] => gigs.filter((g) => g.date >= todayIso()).sort(byDate);
export const pastGigs = (limit = 8): Gig[] =>
  gigs.filter((g) => g.date < todayIso()).sort(byDate).reverse().slice(0, limit);

/** "GMT+02:00"-style offset of a timezone on a given date → "+02:00". */
export function tzOffset(date: string, time: string, tz: string): string {
  const probe = new Date(`${date}T${time}:00Z`);
  const part = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' })
    .formatToParts(probe)
    .find((p) => p.type === 'timeZoneName')?.value;
  const m = part?.match(/GMT([+-]\d{2}:\d{2})/);
  return m?.[1] ?? '+00:00';
}

/** ISO start for structured data: date-only, or full datetime with offset. */
export function gigStartIso(g: Gig): string {
  if (!g.time) return g.date;
  return `${g.date}T${g.time}:00${tzOffset(g.date, g.time, g.timezone ?? DEFAULT_TZ)}`;
}
