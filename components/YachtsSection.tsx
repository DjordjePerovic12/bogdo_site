import { useTranslations } from 'next-intl';
import { YACHTS } from '@/lib/yachts';
import YachtCard, { CHAMPAGNE, SERIF, SANS, eyebrowStyle } from './YachtCard';

export default function YachtsSection() {
  const t = useTranslations('yachts');
  const featured = YACHTS.find((y) => y.featured) ?? YACHTS[0];
  const rest = YACHTS.filter((y) => y.slug !== featured.slug);

  return (
    <section
      id="yachts"
      style={{
        background: '#050a14',
        borderTop: '1px solid rgba(200,180,138,0.18)',
        borderBottom: '1px solid rgba(200,180,138,0.18)',
        padding: 'clamp(5.5rem,11vw,10rem) clamp(1.5rem,6vw,4rem)',
      }}
    >
      <style>{`
        .yacht-card .yacht-card-img img { transition: transform 1.4s cubic-bezier(.2,.6,.2,1); }
        .yacht-card:hover .yacht-card-img img { transform: scale(1.03); }
        .yacht-card-cta { border-bottom: 1px solid transparent; padding-bottom: 3px; transition: border-color 0.4s; }
        .yacht-card:hover .yacht-card-cta, .yacht-card:focus-visible .yacht-card-cta { border-color: ${CHAMPAGNE}; }
        .yachts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1.5rem, 3vw, 2.5rem); }
        @media (max-width: 900px) { .yachts-grid { grid-template-columns: 1fr 1fr; } }
        .yacht-card--feature { grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: clamp(2rem, 4vw, 3.5rem); align-items: center; }
        @media (max-width: 760px) {
          .yacht-card--feature { grid-template-columns: 1fr; gap: 1.25rem; }
          .yachts-meta { text-align: left !important; }
        }
        @media (max-width: 600px) { .yachts-grid { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) { .yacht-card .yacht-card-img img { transition: none; } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.5rem 3rem',
            marginBottom: 'clamp(3rem,6vw,4.5rem)',
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.4rem' }}>
              <span style={{ width: 36, height: 1, background: CHAMPAGNE, opacity: 0.7 }} />
              <span style={eyebrowStyle}>{t('eyebrow')}</span>
            </div>
            <h2
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(2.6rem, 6vw, 4.4rem)',
                lineHeight: 1.02,
                color: '#f2f4f7',
                marginBottom: '1.1rem',
              }}
            >
              {t('title')}
            </h2>
            <p style={{ fontFamily: SANS, fontSize: '1rem', fontWeight: 300, color: '#9aabbf', lineHeight: 1.7 }}>
              {t('subtitle')}
            </p>
          </div>
          <div style={{ textAlign: 'right' }} className="yachts-meta">
            <p style={{ fontFamily: SANS, fontSize: '0.78rem', color: '#7a90a8', lineHeight: 1.8 }}>
              {t('onRequest')}
              <br />
              {t('credit')}
            </p>
          </div>
        </header>

        <div style={{ marginBottom: 'clamp(3rem,6vw,4.5rem)' }}>
          <YachtCard yacht={featured} variant="feature" />
        </div>

        <div className="yachts-grid">
          {rest.map((yacht) => (
            <YachtCard key={yacht.slug} yacht={yacht} />
          ))}
        </div>
      </div>
    </section>
  );
}
