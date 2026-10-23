'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function CTABanner() {
  const t = useTranslations('cta');

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0090aa, #00b8d9)',
        padding: '4rem clamp(1.5rem,6vw,4rem)',
      }}
    >
      <div
        className="cta-inner"
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        <style>{`@media(max-width:600px){.cta-inner{flex-direction:column;text-align:center;}}`}</style>
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
              fontSize: 'clamp(1.8rem,3.5vw,2.5rem)',
              fontStyle: 'italic',
              fontWeight: 600,
              color: '#fff',
              marginBottom: '0.5rem',
            }}
          >
            {t('heading')}
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              fontSize: '0.95rem',
            }}
          >
            {t('subtext')}
          </p>
        </div>

        <Link href="/booking">
          <span
            style={{
              display: 'inline-block',
              background: '#fff',
              color: '#0090aa',
              borderRadius: 5,
              padding: '15px 36px',
              fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = '0.9')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = '1')}
          >
            {t('button')}
          </span>
        </Link>
      </div>
    </section>
  );
}
