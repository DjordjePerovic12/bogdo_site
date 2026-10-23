import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import BookingForm from '@/components/BookingForm';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';
import { Link } from '@/i18n/navigation';
import { readReferrers } from '@/lib/referrers';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.booking' });
  return { title: t('title'), description: t('description') };
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tour?: string }>;
}) {
  const { locale } = await params;
  const { tour } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'booking' });
  const referrers = readReferrers();

  return (
    <>
      <Navbar locale={locale} />
      <div style={{ paddingTop: 70, minHeight: '100vh', background: '#070c18' }}>
        {/* Dark header */}
        <div
          style={{
            background: '#030710',
            padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,6vw,4rem)',
          }}
        >
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <Link href="/">
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  borderRadius: 4,
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  marginBottom: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                {t('back')}
              </span>
            </Link>
            <h1
              style={{
                fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                fontSize: 'clamp(2rem,4vw,3rem)',
                fontStyle: 'italic',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '0.4rem',
              }}
            >
              {t('pageTitle')}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
              {t('pageSubtitle')}
            </p>
          </div>
        </div>

        {/* Form */}
        <BookingForm initialTourSlug={tour} referrers={referrers} />
      </div>
      <WhatsAppButton />
      <CookieConsent />
    </>
  );
}
