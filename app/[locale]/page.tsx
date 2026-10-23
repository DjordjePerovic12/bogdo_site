import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustStrip from '@/components/TrustStrip';
import ToursSection from '@/components/ToursSection';
import YachtsSection from '@/components/YachtsSection';
import CTABanner from '@/components/CTABanner';
import WhySection from '@/components/WhySection';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import GallerySection from '@/components/GallerySection';
import FAQSection from '@/components/FAQSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactFooter from '@/components/ContactFooter';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.home' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kotorbluecave.me';
  const ogImage = `${siteUrl}/images/og-home.jpg`;

  return {
    title: t('title'),
    description: t('description'),
    keywords: 'kotor blue cave, blue cave tour kotor, speedboat tour kotor, boat tours kotor, boka bay tour, perast tour, kotor boat trip, blue cave montenegro, kotor bay tour',
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${siteUrl}/${locale}`,
      siteName: 'Speed Boat Tour Kotor',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'Speedboat tour in Boka Bay, Kotor Montenegro' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteUrl}/en`,
      languages: {
        en: `${siteUrl}/en`,
        ru: `${siteUrl}/ru`,
        de: `${siteUrl}/de`,
        es: `${siteUrl}/es`,
        fr: `${siteUrl}/fr`,
        'x-default': `${siteUrl}/en`,
      },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      {/* LocalBusiness + TouristAttraction */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'TouristAttraction'],
        name: 'Speed Boat Tour Kotor',
        description: 'Speedboat tours in Kotor Bay, Montenegro. Blue Cave tours, Perast tours, and private boat trips in Boka Bay.',
        url: 'https://kotorbluecave.me',
        telephone: '+38268620177',
        email: 'boattourskotor1@gmail.com',
        image: 'https://kotorbluecave.me/images/og-home.jpg',
        priceRange: '€€',
        currenciesAccepted: 'EUR',
        paymentAccepted: 'Cash',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Kotor Old Town Marina',
          addressLocality: 'Kotor',
          addressRegion: 'Kotor Municipality',
          addressCountry: 'ME',
          postalCode: '85330',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 42.4247,
          longitude: 18.7712,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
          opens: '09:00',
          closes: '20:00',
        },
        sameAs: ['https://kotorbluecave.me'],
      })}} />

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Where do the tours depart from?', acceptedAnswer: { '@type': 'Answer', text: 'All tours depart from Kotor Old Town Marina, Kotor, Montenegro. The exact meeting point is sent via WhatsApp after booking.' }},
          { '@type': 'Question', name: 'How much does the Blue Cave tour cost?', acceptedAnswer: { '@type': 'Answer', text: 'The Blue Cave group tour costs €40 per person. A private Blue Cave tour costs €300 per boat for up to 12 passengers.' }},
          { '@type': 'Question', name: 'How do I get to the Blue Cave from Kotor?', acceptedAnswer: { '@type': 'Answer', text: 'The Blue Cave (Plava Špilja) is best reached by speedboat from Kotor. Our Blue Cave tour takes approximately 3–4 hours and covers Perast, Our Lady of the Rocks, Porto Montenegro, Mamula Island, and the Blue Cave.' }},
          { '@type': 'Question', name: 'What is included in the tour price?', acceptedAnswer: { '@type': 'Answer', text: 'All tours include a professional licensed skipper, fuel, life jackets, and bottled water. The Blue Cave tour also includes snorkeling gear.' }},
          { '@type': 'Question', name: 'How do I pay?', acceptedAnswer: { '@type': 'Answer', text: 'Payment is collected in cash on the day of the tour at the marina. No advance payment or deposit is required for group tours.' }},
          { '@type': 'Question', name: 'Can children join the tours?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, children of all ages are welcome. Life jackets are provided for children. All children must be accompanied by an adult.' }},
          { '@type': 'Question', name: 'What happens if the weather is bad?', acceptedAnswer: { '@type': 'Answer', text: 'Safety is our priority. If weather or sea conditions are unsuitable, the tour will be rescheduled or adjusted with an alternative route.' }},
        ],
      })}} />

      {/* Breadcrumb */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Speed Boat Tour Kotor', item: 'https://kotorbluecave.me/en' },
        ],
      })}} />
      <Navbar locale={locale} />
      <main>
        <Hero />
        <TrustStrip />
        <ToursSection />
        <CTABanner />
        <YachtsSection />
        <WhySection />
        <WhatsAppCTA />
        <GallerySection />
        <TestimonialsSection />
        <FAQSection />
        <ContactFooter />
      </main>
      <WhatsAppButton />
      <CookieConsent />
      <Analytics />
    </>
  );
}
