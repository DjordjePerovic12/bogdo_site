import { getTranslations } from 'next-intl/server';
import ReviewForm from '@/components/ReviewForm';
import Navbar from '@/components/Navbar';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'review' });
  return { title: t('pageTitle'), robots: 'noindex' };
}

export default async function ReviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'review' });

  return (
    <>
      <Navbar locale={locale} />
      <main style={{
        minHeight: '100dvh',
        background: '#070c18',
        padding: 'clamp(6rem,10vw,8rem) clamp(1.5rem,6vw,4rem) clamp(3rem,6vw,5rem)',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p style={{
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#00b8d9', marginBottom: '1rem',
          }}>
            Speed Boat Tour Kotor
          </p>
          <h1 style={{
            fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
            fontSize: 'clamp(2.2rem,5vw,3.2rem)', fontStyle: 'italic', fontWeight: 600,
            color: '#dce8f5', lineHeight: 1.15, marginBottom: '0.75rem',
          }}>
            {t('heading')}
          </h1>
          <p style={{
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            fontSize: '0.95rem', color: '#7a90a8', lineHeight: 1.65, marginBottom: '2.5rem',
          }}>
            {t('subtext')}
          </p>
          <ReviewForm />
        </div>
      </main>
    </>
  );
}
