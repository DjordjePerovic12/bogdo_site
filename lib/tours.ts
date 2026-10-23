export type TourType = 'group' | 'private';

export interface Tour {
  slug: string;
  type: TourType;
  name: string;
  tagline: string;
  description: string;
  duration: string;
  durationNote?: string;
  capacity: number;
  capacityLabel: string;
  price: string;
  basePrice: number;
  priceUnit: string;
  priceNote?: string;
  timeSlots: string[];
  stops: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  popular?: boolean;
  gradientFrom: string;
  gradientTo: string;
  image: string;
}

export const TOURS: Tour[] = [
  {
    slug: 'perast-tour',
    type: 'group',
    name: 'Perast Tour',
    tagline: 'Discover the Baroque beauty of Perast and the island church of Our Lady of the Rocks',
    description:
      'Cruise along the stunning Bay of Kotor to the historic town of Perast and the iconic island of Our Lady of the Rocks (Gospa od Škrpjela). Spend 25–30 minutes exploring each stop, soaking in centuries of maritime history and breathtaking views.',
    duration: '~2 hours',
    capacity: 12,
    capacityLabel: 'Small group',
    price: '€25',
    basePrice: 25,
    priceUnit: 'per person',
    timeSlots: ['09:00', '12:00', '15:00', '18:00'],
    stops: [
      'Our Lady of the Rocks (Gospa od Škrpjela) — 25–30 min',
      'Old Town Perast — 25–30 min',
    ],
    highlights: [
      'Perast old town',
      'Our Lady of the Rocks island',
      'Inner bay panorama',
      'Venetian architecture',
      'Island church visit',
    ],
    included: ['Professional skipper', 'Fuel', 'Life jackets', 'Bottled water'],
    notIncluded: ['Church entry fee', 'Food & drinks', 'Tips'],
    gradientFrom: '#1a3a5c',
    gradientTo: '#2d7a9a',
    image: '/images/tour-perast.jpg',
  },
  {
    slug: 'blue-cave-tour',
    type: 'group',
    name: 'Blue Cave Tour',
    tagline: 'The ultimate Boka Bay experience — from Perast to the mystical Blue Cave',
    description:
      'Our most comprehensive tour takes you through the highlights of Boka Bay. Visit Perast and Our Lady of the Rocks, enjoy panoramic views of Porto Montenegro and the historic submarine tunnels, admire the Mamula fortress from the water, and explore the magical Blue Cave.',
    duration: '~3–4 hours',
    capacity: 12,
    capacityLabel: 'Small group',
    price: '€40',
    basePrice: 40,
    priceUnit: 'per person',
    timeSlots: ['09:00', '12:00', '15:00', '18:00'],
    stops: [
      'Perast — 25–30 min',
      'Our Lady of the Rocks (Gospa od Škrpjela) — 25–30 min',
      'Porto Montenegro — panoramic view',
      'Submarine tunnels — panoramic view',
      'Mamula Island — panoramic view',
      'Blue Cave (Plava Špilja) — 25–30 min',
    ],
    highlights: [
      'Blue Cave & Mamula',
      'Perast & Our Lady of the Rocks',
      'Porto Montenegro',
      'Submarine tunnels',
      'Snorkeling stop',
    ],
    included: [
      'Professional skipper',
      'Fuel',
      'Life jackets',
      'Snorkeling gear',
      'Bottled water',
    ],
    notIncluded: ['Blue Cave entry fee (€5)', 'Food & drinks', 'Tips'],
    popular: true,
    gradientFrom: '#0a2e50',
    gradientTo: '#0c6b8e',
    image: '/images/tour-blue-cave.jpg',
  },
  {
    slug: 'private-perast-tour',
    type: 'private',
    name: 'Private Perast Tour',
    tagline: 'Explore Perast and Our Lady of the Rocks on your own private speedboat',
    description:
      'Experience the Bay of Kotor\'s most beautiful landmarks in complete privacy. Your own boat and skipper take you to Perast and Our Lady of the Rocks — just your group, at your pace.',
    duration: '~2 hours',
    capacity: 12,
    capacityLabel: 'Up to 12 passengers',
    price: '€150',
    basePrice: 150,
    priceUnit: 'per boat',
    timeSlots: ['Flexible'],
    stops: [
      'Our Lady of the Rocks (Gospa od Škrpjela) — 25–30 min',
      'Old Town Perast — 25–30 min',
    ],
    highlights: [
      'Fully private — your group only',
      'Perast old town',
      'Our Lady of the Rocks island',
      'Inner bay panorama',
      'Island church visit',
    ],
    included: ['Professional skipper', 'Fuel', 'Life jackets', 'Bottled water'],
    notIncluded: ['Church entry fee', 'Food & drinks', 'Tips'],
    gradientFrom: '#1a3a5c',
    gradientTo: '#2d7a9a',
    image: '/images/tour-private-perast.jpg',
  },
  {
    slug: 'private-blue-cave-tour',
    type: 'private',
    name: 'Private Blue Cave Tour',
    tagline: 'The full Boka Bay experience — from Perast to the Blue Cave, entirely your own',
    description:
      'Take the complete Blue Cave route with just your group. Visit Perast, Our Lady of the Rocks, Porto Montenegro, the submarine tunnels, Mamula Island, and the mystical Blue Cave — entirely privately.',
    duration: '~3–4 hours',
    capacity: 12,
    capacityLabel: 'Up to 12 passengers',
    price: '€300',
    basePrice: 300,
    priceUnit: 'per boat',
    timeSlots: ['Flexible'],
    stops: [
      'Perast — 25–30 min',
      'Our Lady of the Rocks (Gospa od Škrpjela) — 25–30 min',
      'Porto Montenegro — panoramic view',
      'Submarine tunnels — panoramic view',
      'Mamula Island — panoramic view',
      'Blue Cave (Plava Špilja) — 25–30 min',
    ],
    highlights: [
      'Fully private — your group only',
      'Blue Cave & Mamula',
      'Perast & Our Lady of the Rocks',
      'Porto Montenegro',
      'Snorkeling stop',
    ],
    included: [
      'Professional skipper',
      'Fuel',
      'Life jackets',
      'Snorkeling gear',
      'Bottled water',
    ],
    notIncluded: ['Blue Cave entry fee (€5)', 'Food & drinks', 'Tips'],
    gradientFrom: '#0a2e50',
    gradientTo: '#0c6b8e',
    image: '/images/tour-private-blue-cave.jpg',
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return TOURS.find((t) => t.slug === slug);
}
