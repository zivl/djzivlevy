// English is the source dictionary: every other locale must match this shape
// (enforced by the `Dict` type, so a missing key fails `astro check`).
// Placeholders: {email}, {platform}, {year}.
export const en = {
  langName: 'English',
  intl: 'en-GB',
  ogLocale: 'en_US',
  meta: {
    home: {
      title: 'DJ Ziv Levy – Techno, Dark 80s & EBM DJ | Tel Aviv',
      description:
        'DJ Ziv Levy is a Tel Aviv DJ playing techno, dark 80s, synthwave, EBM and post-punk. Watch DJ sets, hear his music and book him for your event.',
    },
    epk: {
      title: 'Press Kit – DJ Ziv Levy | Bio, Mixes & Tech Rider',
      description:
        'Electronic press kit for DJ Ziv Levy: bio, featured mixes, photos, logos, technical rider and booking contacts for clubs, festivals and private events.',
    },
  },
  /** One-sentence entity summary, reused in llms.txt, JSON-LD and the Markdown twins. */
  summary:
    'DJ Ziv Levy is a Tel Aviv–based DJ playing techno, progressive, dark 80s, synthwave, EBM and post-punk at clubs, festivals and private events.',
  tagline: 'Tel Aviv DJ · Techno · Dark 80s · EBM',
  specializing: 'Specializing in',
  intro:
    'Dark synths, driving techno and the heavy pulse of EBM. Based in Tel Aviv, DJ Ziv Levy builds sets that travel from cold-wave nostalgia to the cutting edge of the dance floor – for clubs, festivals and private events.',
  bio: 'Merging the precision of a software engineer with the raw, kinky energy of the underground, Ziv’s sets are immersive narratives. From the cold synth-lines of Berlin to the pulsating rhythms of Tel Aviv, he balances nostalgia with the cutting edge of AI-driven music mixing.',
  cta: { book: 'Book a gig', pressKit: 'Press Kit' },
  sections: {
    sets: 'Watch & Listen to DJ Sets',
    music: 'My Music',
    musicLead: 'My releases on all major streaming platforms.',
    gigs: 'Upcoming Gigs',
    pastGigs: 'Recent Gigs',
    noGigs: 'New dates are announced on Instagram first.',
    vibe: 'The Vibe',
    featured: 'Featured Mixes',
    gallery: 'Gallery',
    rider: 'Technical Requirements',
    assets: 'Logos & Press Assets',
    booking: 'For Bookings & Inquiries',
    faq: 'FAQ',
  },
  rider: {
    booth: 'Booth Setup',
    monitoring: 'Monitoring & Audio',
    orHigher: 'or higher',
    items: {
      laptopDesk: 'Stable desk area for Laptop / AI Controller',
      monitors: '2x High-quality booth monitors (adjustable level)',
      outputs: 'XLR or 1/4" Master outputs',
      power: 'Clean power source in booth',
    },
    note: 'Note: For sets utilizing live AI-mixing components, a direct ethernet line or high-speed dedicated WiFi is required.',
  },
  video: { play: 'Play', watchOn: 'Watch on YouTube' },
  embed: { load: 'Load player', notice: 'Loads the {platform} player. {platform} may set cookies.' },
  music: { listenOn: 'Listen on' },
  gigs: { tickets: 'Tickets', calendar: 'Add all gigs to your calendar' },
  gallery: {
    download: 'Download',
    close: 'Close',
    open: 'Enlarge photo',
    alts: {
      portrait: 'Portrait of DJ Ziv Levy wearing headphones',
      booth: 'DJ booth with Pioneer gear facing a large crowd under blue lights',
      crowd: 'Crowd dancing under red and pink stage lights',
      neonHall: 'Party hall bathed in pink neon with a glowing star installation',
      redDetail: 'Abstract red-lit detail of fishnet and vinyl fabric',
    },
  },
  assets: {
    logoBlack: 'Black logo',
    logoWhite: 'White logo',
    download: 'Download PNG',
    photosNote: 'Press photos can be downloaded from the gallery.',
  },
  booking: {
    lead: 'Send the date, venue and the kind of event you’re planning.',
    whatsapp: 'WhatsApp me',
    instagram: 'DM me on Instagram',
    email: 'Email',
  },
  nav: { links: 'Links', language: 'Language', skip: 'Skip to content', home: 'Home', newTab: '(opens in a new tab)', social: 'Social links' },
  footer: {
    policies: 'You acknowledge that you have read and agreed to the following policies:',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    accessibility: 'Accessibility statement',
    englishOnly: '(English)',
  },
  faq: [
    {
      q: 'What music does DJ Ziv Levy play?',
      a: 'Techno, melodic techno and progressive house – plus a deep dark-80s side: synthwave, EBM, post-punk, cold wave, gothic and synth-pop. A set can stay in one lane or tell a story across all of them.',
    },
    {
      q: 'Where is DJ Ziv Levy based, and does he travel?',
      a: 'He is based in Tel Aviv, Israel. For events abroad, get in touch with the date and location.',
    },
    {
      q: 'What kind of events does he play?',
      a: 'Clubs, festivals, themed parties and private events.',
    },
    {
      q: 'How do I book DJ Ziv Levy?',
      a: 'Send a WhatsApp message or an Instagram DM with the date, venue, city and the kind of event – or email {email}.',
    },
    {
      q: 'What equipment is required?',
      a: '2x Pioneer CDJ-2000 Nexus or higher, a Pioneer DJM-900 Nexus or higher, two booth monitors and a stable desk area for a laptop. Full details are in the technical rider.',
    },
  ],
};

export type Dict = typeof en;
