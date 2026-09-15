export interface Topic {
  id: string;
  slug: string;
  name: string;
  category: 'aptitude' | 'reasoning' | 'verbal' | 'coding';
  parentTopic?: string;
  relatedTopics: string[];
  practiceRoute?: string;
  mockRoute?: string;
}

export const navigationConfig: Record<string, Topic> = {
  // Aptitude
  'percentage': {
    id: 'percentage',
    slug: '/aptitude/percentage',
    name: 'Percentage',
    category: 'aptitude',
    parentTopic: 'aptitude-pillar',
    relatedTopics: ['profit-loss', 'ratio-proportion', 'average'],
    practiceRoute: '/practice/percentage',
    mockRoute: '/mock-tests/aptitude',
  },
  // Add other topics as we build them...
};

export const pillars = {
  'tcs-nqt': {
    slug: '/tcs-nqt',
    name: 'TCS NQT',
    children: ['aptitude-pillar', 'reasoning-pillar', 'verbal-pillar', 'coding-pillar'],
  },
  'aptitude-pillar': {
    slug: '/tcs-nqt/aptitude',
    name: 'Aptitude',
    parent: 'tcs-nqt',
  },
  // ...
};
