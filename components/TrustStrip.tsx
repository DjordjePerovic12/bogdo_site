import { useTranslations } from 'next-intl';

export default function TrustStrip() {
  const t = useTranslations('trust');

  const items = [
    { icon: '✓', text: t('based') },
    { icon: '✓', text: t('licensed') },
    { icon: '✓', text: t('newBoats') },
    { icon: '✓', text: t('guests') },
    { icon: '✓', text: t('direct') },
  ];

  return (
    <section style={{ background: '#030710', padding: '1.25rem 0', overflowX: 'auto' }}>
      <div
        style={{
          display: 'flex',
          gap: 0,
          minWidth: 'max-content',
          margin: '0 auto',
          padding: '0 2rem',
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0 2rem',
              borderRight: i < items.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>{item.icon}</span>
            <span
              style={{
                fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
              }}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
