import { useTranslations } from 'next-intl';
import { TOURS } from '@/lib/tours';
import TourCard from './TourCard';

function SectionLabel({ number, label }: { number: string | number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <span
        style={{
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          color: '#00b8d9',
          textTransform: 'uppercase',
        }}
      >
        {String(number).padStart(2, '0')}
      </span>
      <div style={{ height: 1, width: 32, background: '#00b8d9', opacity: 0.6 }} />
      <span
        style={{
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          color: '#7a90a8',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export { SectionLabel };

export default function ToursSection() {
  const t = useTranslations('tours');
  const groupTours = TOURS.filter((t) => t.type === 'group');
  const privateTours = TOURS.filter((t) => t.type === 'private');

  return (
    <section
      id="tours"
      style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,4rem)' }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Group tours */}
        <SectionLabel number={1} label={t('groupLabel')} />
        <h2
          style={{
            fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
            fontSize: 'clamp(2rem,4vw,3rem)',
            fontWeight: 600,
            fontStyle: 'italic',
            marginBottom: '0.5rem',
            color: '#dce8f5',
          }}
        >
          {t('groupHeading')}
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            fontSize: '0.95rem',
            color: '#7a90a8',
            marginBottom: '2.5rem',
            maxWidth: 500,
            lineHeight: 1.65,
          }}
        >
          {t('groupSubtext')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '4rem' }}>
          {groupTours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>

        {/* Private tours */}
        <SectionLabel number={2} label={t('privateLabel')} />
        <h2
          style={{
            fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
            fontSize: 'clamp(2rem,4vw,3rem)',
            fontWeight: 600,
            fontStyle: 'italic',
            marginBottom: '0.5rem',
            color: '#dce8f5',
          }}
        >
          {t('privateHeading')}
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            fontSize: '0.95rem',
            color: '#7a90a8',
            marginBottom: '2.5rem',
            maxWidth: 500,
            lineHeight: 1.65,
          }}
        >
          {t('privateSubtext')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {privateTours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
