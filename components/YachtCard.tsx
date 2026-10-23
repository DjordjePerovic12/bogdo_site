import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Yacht } from '@/lib/yachts';

export const CHAMPAGNE = '#c8b48a';
export const SERIF = 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)';
export const SANS = 'var(--font-dm-sans, DM Sans, sans-serif)';

export const eyebrowStyle: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: '0.68rem',
  fontWeight: 500,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: CHAMPAGNE,
};

export function YachtSpecs({ yacht, size = 'md' }: { yacht: Yacht; size?: 'md' | 'lg' }) {
  const t = useTranslations('yachts');
  const items = [
    `${yacht.lengthM} m`,
    t('guestsCount', { count: yacht.guests }),
    ...(yacht.cabins ? [t('cabinsCount', { count: yacht.cabins })] : []),
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: size === 'lg' ? '0 1.1rem' : '0 0.8rem' }}>
      {items.map((item, i) => (
        <span key={item} style={{ display: 'flex', alignItems: 'center', gap: size === 'lg' ? '1.1rem' : '0.8rem' }}>
          {i > 0 && <span style={{ width: 1, height: '0.9em', background: 'rgba(200,180,138,0.35)' }} />}
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: size === 'lg' ? '1.45rem' : '1.15rem',
              color: '#dce8f5',
              whiteSpace: 'nowrap',
              fontVariantNumeric: 'lining-nums',
            }}
          >
            {item}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function YachtCard({ yacht, variant = 'standard' }: { yacht: Yacht; variant?: 'feature' | 'standard' }) {
  const t = useTranslations('yachts');
  const feature = variant === 'feature';

  return (
    <Link href={`/yachts/${yacht.slug}`} className="yacht-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div
        className={feature ? 'yacht-card-img yacht-card-img--feature' : 'yacht-card-img'}
        style={{
          position: 'relative',
          aspectRatio: feature ? '21 / 9' : '4 / 5',
          overflow: 'hidden',
          borderRadius: 2,
          background: '#0a1220',
        }}
      >
        <Image
          src={yacht.hero}
          alt={`${yacht.name}, ${yacht.builder} ${yacht.model}`}
          fill
          sizes={feature ? '(max-width: 1100px) 100vw, 1100px' : '(max-width: 760px) 100vw, 360px'}
          style={{ objectFit: 'cover', objectPosition: (feature ? yacht.heroPosition : yacht.cardPosition) ?? 'center' }}
        />
      </div>

      <div
        className={feature ? 'yacht-card-body--feature' : undefined}
        style={{
          paddingTop: feature ? '1.6rem' : '1.25rem',
          display: feature ? 'flex' : 'block',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ ...eyebrowStyle, marginBottom: '0.55rem' }}>
            {yacht.builder} {yacht.model} · {yacht.year}
          </div>
          <h3
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: feature ? 'clamp(2.4rem, 5vw, 3.6rem)' : 'clamp(1.9rem, 3vw, 2.4rem)',
              lineHeight: 1,
              color: '#f2f4f7',
              marginBottom: feature ? 0 : '0.8rem',
            }}
          >
            {yacht.name}
          </h3>
          {!feature && <YachtSpecs yacht={yacht} />}
        </div>

        {feature ? (
          <div className="yacht-card-feature-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.9rem' }}>
            <YachtSpecs yacht={yacht} size="lg" />
            <span className="yacht-card-cta" style={{ ...eyebrowStyle, color: '#dce8f5' }}>
              {t('request')} <span aria-hidden style={{ color: CHAMPAGNE }}>→</span>
            </span>
          </div>
        ) : (
          <span className="yacht-card-cta" style={{ ...eyebrowStyle, color: '#dce8f5', display: 'inline-block', marginTop: '1.1rem' }}>
            {t('view')} <span aria-hidden style={{ color: CHAMPAGNE }}>→</span>
          </span>
        )}
      </div>
    </Link>
  );
}
