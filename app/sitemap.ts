import type { MetadataRoute } from 'next';
import { TOURS } from '@/lib/tours';
import { YACHTS } from '@/lib/yachts';

const locales = ['en', 'ru', 'me', 'de', 'es', 'fr'];
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kotorbluecave.me';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/booking', '/terms-conditions', '/privacy-policy'];
  const tourPages = TOURS.map((t) => `/tours/${t.slug}`);
  const yachtPages = YACHTS.map((y) => `/yachts/${y.slug}`);
  const allPaths = [...staticPages, ...tourPages, ...yachtPages];

  return allPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : path.startsWith('/tours') || path.startsWith('/yachts') ? 0.8 : 0.6,
    }))
  );
}
