import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import ContactFooter from '@/components/ContactFooter';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';
import { Link } from '@/i18n/navigation';
import { TOURS, getTourBySlug } from '@/lib/tours';

export async function generateStaticParams() {
  const locales = ['en', 'ru', 'me', 'de', 'es', 'fr'];
  const slugs = TOURS.map((t) => t.slug);
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return {};

  const nsMap: Record<string, string> = {
    'perast-tour': 'seo.perastTour',
    'blue-cave-tour': 'seo.blueCaveTour',
    'private-perast-tour': 'seo.privatePerastTour',
    'private-blue-cave-tour': 'seo.privateBlueCaveTour',
  };

  const t = await getTranslations({ locale, namespace: nsMap[slug] || 'seo.home' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kotorbluecave.me';
  const ogImage = `${siteUrl}${tour.image}`;

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${siteUrl}/${locale}/tours/${slug}`,
      siteName: 'Speed Boat Tour Kotor',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: tour.name }],
    },
    twitter: { card: 'summary_large_image', title: t('title'), description: t('description'), images: [ogImage] },
    alternates: {
      canonical: `${siteUrl}/en/tours/${slug}`,
      languages: {
        en: `${siteUrl}/en/tours/${slug}`,
        de: `${siteUrl}/de/tours/${slug}`,
        fr: `${siteUrl}/fr/tours/${slug}`,
        es: `${siteUrl}/es/tours/${slug}`,
        ru: `${siteUrl}/ru/tours/${slug}`,
        'x-default': `${siteUrl}/en/tours/${slug}`,
      },
    },
  };
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  const t = await getTranslations({ locale, namespace: 'tours' });
  const otherTours = TOURS.filter((t) => t.slug !== slug).slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kotorbluecave.me';
  const priceValue = tour.price.replace('€', '');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: tour.name,
        description: tour.description,
        image: `${siteUrl}${tour.image}`,
        url: `${siteUrl}/en/tours/${slug}`,
        touristType: tour.type === 'private' ? 'Private group' : 'Small group',
        itinerary: {
          '@type': 'ItemList',
          itemListElement: tour.stops.map((stop, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: stop,
          })),
        },
        offers: {
          '@type': 'Offer',
          price: priceValue,
          priceCurrency: 'EUR',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: priceValue,
            priceCurrency: 'EUR',
            unitText: tour.priceUnit,
          },
          availability: 'https://schema.org/InStock',
          validFrom: '2026-05-01',
          validThrough: '2026-10-31',
        },
        provider: {
          '@type': 'LocalBusiness',
          name: 'Speed Boat Tour Kotor',
          telephone: '+38268620177',
          url: 'https://kotorbluecave.me',
        },
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/en` },
          { '@type': 'ListItem', position: 2, name: 'Tours', item: `${siteUrl}/en/#tours` },
          { '@type': 'ListItem', position: 3, name: tour.name, item: `${siteUrl}/en/tours/${slug}` },
        ],
      })}} />
      <Navbar locale={locale} />
      <div style={{ paddingTop: 70 }}>
        {/* Tour hero */}
        <div
          style={{
            minHeight: 380,
            background: `linear-gradient(160deg, ${tour.gradientFrom} 0%, ${tour.gradientTo} 100%)`,
            display: 'flex',
            alignItems: 'flex-end',
            padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,4rem)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Image
            src={tour.image}
            alt={tour.name}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(5,13,26,0.85) 0%, rgba(5,13,26,0.3) 60%, rgba(5,13,26,0.2) 100%)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 960, width: '100%', margin: '0 auto' }}>
            <Link href="/#tours">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  borderRadius: 4,
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  marginBottom: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                {t('allTours')}
              </span>
            </Link>
            <div style={{ display: 'flex', gap: 8, marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: tour.type === 'private' ? 'rgba(200,138,0,0.8)' : 'rgba(0,152,180,0.8)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  borderRadius: 3,
                }}
              >
                {tour.type === 'private' ? t('privateTour') : t('smallGroup')}
              </span>
              {tour.popular && (
                <span
                  style={{
                    background: '#e0a020',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: 3,
                  }}
                >
                  {t('popular')}
                </span>
              )}
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                fontSize: 'clamp(2.2rem,5vw,4rem)',
                fontStyle: 'italic',
                fontWeight: 600,
                color: '#fff',
                lineHeight: 1.05,
                marginBottom: '0.5rem',
              }}
            >
              {tour.name}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem' }}>{tour.tagline}</p>
          </div>
        </div>

        {/* Key facts strip */}
        <div style={{ background: '#0f1930', borderBottom: '1px solid #1a2840', overflowX: 'auto' }}>
          <div
            style={{
              maxWidth: 960,
              margin: '0 auto',
              padding: '0 clamp(1.5rem,6vw,4rem)',
              display: 'flex',
              gap: 0,
            }}
          >
            {[
              { label: t('duration'), value: tour.duration },
              { label: t('groupSize'), value: tour.capacityLabel },
              { label: t('price'), value: tour.price },
              { label: t('per'), value: tour.priceUnit },
            ].map((item, i, arr) => (
              <div
                key={i}
                style={{
                  padding: '1.25rem 2rem',
                  borderRight: i < arr.length - 1 ? '1px solid #1a2840' : 'none',
                  minWidth: 'max-content',
                }}
              >
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#7a90a8',
                    marginBottom: 4,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    color: '#00b8d9',
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,4rem)',
          }}
        >
          <div
            className="tour-layout"
            style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem', alignItems: 'start' }}
          >
            <style>{`@media(max-width:768px){.tour-layout{grid-template-columns:1fr !important;} .tour-sidebar{order:-1 !important; position:static !important;}} .tour-card-hover{transition:transform 0.2s;} .tour-card-hover:hover{transform:translateY(-2px);}`}</style>

            {/* Content */}
            <div>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#7a90a8',
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                }}
              >
                {tour.description}
              </p>

              {/* Highlights */}
              <h3
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#dce8f5',
                  marginBottom: '1rem',
                }}
              >
                {t('highlights')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                {tour.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ color: '#00b8d9', marginTop: 2, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '0.9rem', color: '#7a90a8', lineHeight: 1.5 }}>{h}</span>
                  </div>
                ))}
              </div>

              {/* What's included */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="inc-grid">
                <style>{`@media(max-width:500px){.inc-grid{grid-template-columns:1fr !important;}}`}</style>
                <div>
                  <h3
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#dce8f5',
                      marginBottom: '1rem',
                    }}
                  >
                    {t('whatsIncluded')}
                  </h3>
                  {tour.included.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <span style={{ color: '#00b8d9', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '0.875rem', color: '#7a90a8' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#dce8f5',
                      marginBottom: '1rem',
                    }}
                  >
                    {t('notIncluded')}
                  </h3>
                  {tour.notIncluded.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <span style={{ color: '#7a90a8', flexShrink: 0 }}>×</span>
                      <span style={{ fontSize: '0.875rem', color: '#7a90a8' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Route */}
              {tour.stops.length > 1 && (
                <div style={{ marginTop: '2rem' }}>
                  <h3
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#dce8f5',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {t('tabs.route')}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {tour.stops.map((stop, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: i === 0 || i === tour.stops.length - 1 ? '#00b8d9' : '#1a2840',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              color: i === 0 || i === tour.stops.length - 1 ? '#fff' : '#7a90a8',
                            }}
                          >
                            {i + 1}
                          </div>
                          {i < tour.stops.length - 1 && (
                            <div style={{ width: 1, flex: 1, background: '#1a2840', minHeight: 20 }} />
                          )}
                        </div>
                        <span style={{ fontSize: '0.9rem', color: '#7a90a8', paddingTop: 4 }}>{stop}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div
              className="tour-sidebar"
              style={{
                background: '#0f1930',
                border: '1px solid #1a2840',
                borderRadius: 8,
                padding: '1.75rem',
                position: 'sticky',
                top: 88,
              }}
            >
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#7a90a8', display: 'block', marginBottom: 4 }}>
                  {t('startingFrom')}
                </span>
                <div
                  style={{
                    fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                    fontSize: '2rem',
                    fontWeight: 600,
                    color: '#00b8d9',
                  }}
                >
                  {tour.price}
                  <span style={{ fontSize: '0.85rem', color: '#7a90a8', fontWeight: 400 }}>
                    {' '}/{tour.priceUnit}
                  </span>
                </div>
                {tour.priceNote && (
                  <p style={{ fontSize: '0.75rem', color: '#7a90a8', marginTop: 4 }}>{tour.priceNote}</p>
                )}
              </div>

              <div
                style={{
                  background: '#0a1220',
                  borderRadius: 6,
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.78rem',
                  color: '#7a90a8',
                  lineHeight: 1.6,
                }}
              >
                Payment collected in cash on the day of the tour.
              </div>

              <Link href={`/booking?tour=${tour.slug}`}>
                <span
                  style={{
                    display: 'block',
                    width: '100%',
                    background: '#00b8d9',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 5,
                    padding: '14px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    marginBottom: '0.75rem',
                    textAlign: 'center',
                  }}
                >
                  Book This Tour
                </span>
              </Link>

              <a
                href="https://wa.me/38268620177"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  background: '#25D366',
                  color: '#fff',
                  borderRadius: 5,
                  padding: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Ask on WhatsApp
              </a>
            </div>
          </div>

          {/* Related tours */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1a2840' }}>
            <h3
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#7a90a8',
                marginBottom: '1.5rem',
              }}
            >
              {t('relatedTitle')}
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
              }}
            >
              {otherTours.map((other) => (
                <Link key={other.slug} href={`/tours/${other.slug}`}>
                  <div className="tour-card-hover" style={{ border: '1px solid #1a2840', borderRadius: 7, overflow: 'hidden', cursor: 'pointer' }}>
                    <div style={{ height: 90, position: 'relative', background: other.gradientFrom }}>
                      <Image
                        src={other.image}
                        alt={other.name}
                        fill
                        sizes="280px"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </div>
                    <div style={{ padding: '0.9rem 1rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#dce8f5', marginBottom: 2 }}>
                        {other.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#7a90a8' }}>
                        {other.duration} · {other.price}/{other.priceUnit}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <ContactFooter />
      </div>
      <WhatsAppButton />
      <CookieConsent />
    </>
  );
}
