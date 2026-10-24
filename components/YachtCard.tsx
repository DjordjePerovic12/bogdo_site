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
  const [w, h] = yacht.heroSize;

  return (
    <Link
      href={`/yachts/${yacht.slug}`}
      className={feature ? 'yacht-card yacht-card--feature' : 'yacht-card'}
      style={{ display: feature ? 'grid' : 'block', textDecoration: 'none', color: 'inherit' }}
    >
      {/* The feature card follows the photo's own ratio; the row uses 3:2, within a few % of every photo, so cards line up and the boat stays in frame. */}
      <div
        className="yacht-card-img"
        style={{ position: 'relative', aspectRatio: feature ? `${w} / ${h}` : '3 / 2', overflow: 'hidden', borderRadius: 2, background: '#0a1220' }}
      >
        <Image
          src={yacht.hero}
          alt={`${yacht.name}, ${yacht.builder} ${yacht.model}`}
          fill
          sizes={feature ? '(max-width: 760px) 100vw, 660px' : '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 360px'}
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div style={{ paddingTop: feature ? 0 : '1.25rem' }} className={feature ? 'yacht-card-body--feature' : undefined}>
        <div style={{ ...eyebrowStyle, marginBottom: '0.55rem' }}>
          {yacht.builder} {yacht.model} · {yacht.year}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: feature ? 'clamp(2.6rem, 5vw, 3.8rem)' : 'clamp(1.9rem, 3vw, 2.4rem)',
            lineHeight: 1,
            color: '#f2f4f7',
            marginBottom: feature ? '1rem' : '0.8rem',
          }}
        >
          {yacht.name}
        </h3>
        {feature && (
          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.95rem', color: '#9aabbf', lineHeight: 1.7, marginBottom: '1.4rem' }}>
            {yacht.tagline}
          </p>
        )}
        <YachtSpecs yacht={yacht} size={feature ? 'lg' : 'md'} />
        <span
          className="yacht-card-cta"
          style={{ ...eyebrowStyle, color: '#dce8f5', display: 'inline-block', marginTop: feature ? '1.8rem' : '1.1rem' }}
        >
          {feature ? t('request') : t('view')} <span aria-hidden style={{ color: CHAMPAGNE }}>→</span>
        </span>
      </div>
    </Link>
  );
}
