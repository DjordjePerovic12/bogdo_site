import { useTranslations } from 'next-intl';
import { SectionLabel } from './ToursSection';

export default function WhySection() {
  const t = useTranslations('whyUs');
  const items = t.raw('items') as Array<{ num: string; title: string; body: string }>;

  return (
    <section
      id="about"
      style={{
        background: '#0a1220',
        padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,4rem)',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionLabel number={3} label={t('sectionLabel')} />
        <h2
          style={{
            fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
            fontSize: 'clamp(2rem,4vw,3rem)',
            fontStyle: 'italic',
            fontWeight: 600,
            marginBottom: '3rem',
            color: '#dce8f5',
          }}
        >
          {t('heading')}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {items.map((item) => (
            <div key={item.num}>
              <div
                style={{
                  fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                  fontSize: '2.5rem',
                  fontWeight: 300,
                  color: '#00b8d9',
                  opacity: 0.4,
                  lineHeight: 1,
                  marginBottom: '0.75rem',
                }}
              >
                {item.num}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#dce8f5',
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                  fontSize: '0.85rem',
                  color: '#7a90a8',
                  lineHeight: 1.7,
                }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
