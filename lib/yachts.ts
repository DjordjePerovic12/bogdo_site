// Partner fleet operated by AKUL Yachts (Porto Montenegro, Tivat).
// Specs come from akulyachts.me; charter prices are on request.

export interface YachtImage {
  src: string;
  alt: string;
}

export interface Yacht {
  slug: string;
  name: string;
  builder: string;
  model: string;
  year: number;
  refit?: number;
  lengthM: number;
  guests: number;
  crew?: number;
  sleeps: number;
  cabins?: number;
  speedKn?: number;
  featured?: boolean;
  tagline: string;
  intro: string;
  onBoard: { title: string; text: string }[];
  hero: string;
  heroPosition?: string;
  cardPosition?: string;
  gallery: YachtImage[];
}

const img = (slug: string, n: number, alt: string): YachtImage => ({
  src: `/images/yachts/${slug}/${String(n).padStart(2, '0')}.jpg`,
  alt,
});

export const YACHTS: Yacht[] = [
  {
    slug: 'armaar',
    name: 'Armaar',
    builder: 'Astondoa',
    model: '100 Century',
    year: 2017,
    lengthM: 31,
    guests: 12,
    crew: 4,
    sleeps: 10,
    cabins: 5,
    speedKn: 30,
    featured: true,
    tagline: 'Thirty-one metres of Spanish craftsmanship, made for long days on the bay.',
    intro:
      'Armaar is the largest yacht in the fleet: a 31-metre Astondoa 100 Century with a full crew, five en-suite cabins and decks that open out to the water. She cruises at speed when you want to cover the coast, and settles into a quiet anchorage when you don’t.',
    onBoard: [
      {
        title: 'Decks',
        text: 'Sunbathing areas fore and aft, a Jacuzzi and a shaded deck for long lunches. The swim platform takes you straight into the sea.',
      },
      {
        title: 'Salon',
        text: 'Panoramic windows on both sides, deep sofas and a formal dining area.',
      },
      {
        title: 'Cabins',
        text: 'Five cabins for up to ten guests: a master suite, two doubles and two twins, each with its own bathroom.',
      },
      {
        title: 'Performance',
        text: 'Twin engines and a top speed of around 30 knots, so Budva or the open Adriatic are an easy run from Tivat.',
      },
    ],
    hero: '/images/yachts/armaar/03.jpg',
    heroPosition: 'center 60%',
    gallery: [
      img('armaar', 3, 'Armaar foredeck lounge at dusk'),
      img('armaar', 1, 'Armaar at anchor on open water'),
      img('armaar', 6, 'Main salon with panoramic windows'),
      img('armaar', 5, 'Shaded aft deck with dining table'),
      img('armaar', 7, 'Formal dining area'),
      img('armaar', 2, 'Aerial view of Armaar underway'),
      img('armaar', 9, 'Guest double cabin'),
      img('armaar', 8, 'On-board Jacuzzi'),
      img('armaar', 4, 'Foredeck sunpads at sunset'),
      img('armaar', 10, 'Master suite'),
      img('armaar', 11, 'Aft deck looking onto Porto Montenegro'),
      img('armaar', 12, 'Armaar from above'),
    ],
  },
  {
    slug: 'aria',
    name: 'Aria',
    builder: 'Fairline',
    model: 'Squadron 58',
    year: 2008,
    refit: 2026,
    lengthM: 19,
    guests: 15,
    sleeps: 6,
    tagline: 'A British flybridge yacht, freshly refitted, with room for the whole group.',
    intro:
      'Aria is a Fairline Squadron 58, a classic British flybridge yacht refitted for 2026. Fine joinery below and a wide flybridge above make her the easy choice for larger groups and families who want space as well as style.',
    onBoard: [
      {
        title: 'Flybridge',
        text: 'A full second deck with a bimini, wraparound seating and the best view of the bay, whether you are cruising or at anchor.',
      },
      {
        title: 'Salon',
        text: 'A wide U-shaped sofa, a galley and warm cherry woodwork, with windows all round.',
      },
      {
        title: 'Cabins',
        text: 'Berths for six across comfortable cabins finished in polished woodwork.',
      },
      {
        title: 'Seaworthy',
        text: 'Built for the open sea, so she stays comfortable on longer runs along the Montenegrin coast.',
      },
    ],
    hero: '/images/yachts/aria/01.jpg',
    cardPosition: '58% center',
    gallery: [
      img('aria', 1, 'Aria cruising past the Boka Bay hills'),
      img('aria', 2, 'Aerial view of Aria underway'),
      img('aria', 3, 'Aria running along the coast'),
      img('aria', 4, 'Aria at anchor near a village'),
      img('aria', 5, 'Flybridge seating under the bimini'),
      img('aria', 7, 'Main salon'),
      img('aria', 6, 'Bow and foredeck'),
      img('aria', 8, 'Salon and lower helm'),
      img('aria', 9, 'Owner’s cabin with skylight'),
      img('aria', 10, 'Guest double cabin'),
      img('aria', 11, 'Bathroom'),
    ],
  },
  {
    slug: 'akul',
    name: 'Akul',
    builder: 'Cranchi',
    model: 'Z35',
    year: 2021,
    lengthM: 12,
    guests: 8,
    sleeps: 4,
    cabins: 2,
    speedKn: 34,
    tagline: 'An Italian sports cruiser: quick, open and made for a day on the water.',
    intro:
      'Akul is a Cranchi Z35, an Italian sports cruiser with an open cockpit and a turn of speed. She is ideal for couples and small groups who want to see a lot of the coast in one day and still have somewhere comfortable to stop.',
    onBoard: [
      {
        title: 'Cockpit',
        text: 'A C-shaped sofa at the stern that converts to a sunpad, extra seating forward and a wet bar by the helm.',
      },
      {
        title: 'Below deck',
        text: 'A salon with an L-shaped sofa and table, a galley with hob and microwave, and a separate shower room.',
      },
      {
        title: 'Cabins',
        text: 'An owner’s cabin in the bow and a guest cabin aft, sleeping four.',
      },
      {
        title: 'Performance',
        text: 'Twin Volvo Penta D4 diesels with 270 hp each and a top speed of around 34 knots.',
      },
    ],
    hero: '/images/yachts/akul/01.jpg',
    gallery: [
      img('akul', 1, 'Akul running through Boka Bay'),
      img('akul', 2, 'Akul underway in open water'),
      img('akul', 3, 'Akul off Porto Montenegro'),
      img('akul', 4, 'Akul at anchor below the mountains'),
      img('akul', 5, 'Cockpit with guests on board'),
      img('akul', 6, 'Akul from above'),
      img('akul', 7, 'Akul moored by the shore'),
      img('akul', 8, 'Cockpit seating'),
      img('akul', 9, 'Helm and cockpit'),
      img('akul', 10, 'Lunch served on board'),
      img('akul', 11, 'Salon below deck'),
      img('akul', 12, 'Owner’s cabin'),
    ],
  },
  {
    slug: 'azul',
    name: 'Azul',
    builder: 'Bavaria',
    model: 'Vida 33',
    year: 2024,
    lengthM: 11,
    guests: 10,
    sleeps: 2,
    cabins: 1,
    tagline: 'Open-roof day cruiser for swimming stops and slow lunches.',
    intro:
      'Azul is a 2024 Bavaria Vida 33 with an open roof, built around outdoor living. A big cockpit, a wet bar and a convertible bow lounge make her a relaxed way to explore Boka Bay’s beaches and villages.',
    onBoard: [
      {
        title: 'Bow',
        text: 'Choose a flat sunbathing deck or a lounge with a cocktail table and seating for six.',
      },
      {
        title: 'Cockpit',
        text: 'L-shaped seating around a large table that turns into a sunbed, and a wet bar with fridge and sink.',
      },
      {
        title: 'Below deck',
        text: 'A double berth for a quiet break, and a full bathroom to freshen up before going ashore.',
      },
      {
        title: 'Helm',
        text: 'Seats for three at the helm, twin 9-inch displays and two 300 hp Mercury outboards.',
      },
    ],
    hero: '/images/yachts/azul/01.jpg',
    heroPosition: 'center 75%',
    gallery: [
      img('azul', 1, 'Azul off Our Lady of the Rocks, Perast'),
      img('azul', 2, 'Azul cruising through the bay'),
      img('azul', 3, 'Azul in front of Perast'),
      img('azul', 4, 'Guests aboard Azul below the mountains'),
      img('azul', 5, 'Azul underway in the bay'),
      img('azul', 6, 'Cockpit and stern'),
      img('azul', 11, 'Relaxing on the stern'),
      img('azul', 7, 'Cockpit table and lounge'),
      img('azul', 8, 'Open-roof cockpit'),
      img('azul', 9, 'Helm seats'),
      img('azul', 12, 'Azul leaving a wake'),
      img('azul', 10, 'Double berth below deck'),
    ],
  },
];

export function getYachtBySlug(slug: string): Yacht | undefined {
  return YACHTS.find((y) => y.slug === slug);
}
