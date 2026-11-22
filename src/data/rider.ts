// Technical rider. Gear model names are not translated; the descriptive
// items are keys into the i18n `rider.items` dictionary.
export const rider = {
  booth: [
    { gear: '2x Pioneer CDJ-2000 Nexus', qualifier: 'orHigher' },
    { gear: '1x Pioneer DJM-900 Nexus', qualifier: 'orHigher' },
    { item: 'laptopDesk' },
  ],
  monitoring: [{ item: 'monitors' }, { item: 'outputs' }, { item: 'power' }],
} as const;

export type RiderItemKey = 'laptopDesk' | 'monitors' | 'outputs' | 'power';
