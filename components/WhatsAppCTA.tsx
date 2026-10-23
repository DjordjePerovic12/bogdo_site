'use client';

import { useTranslations } from 'next-intl';

const BOGDAN_URL =
  'https://wa.me/38268620177?text=Hi%2C%20I%27d%20like%20to%20book%20a%20speedboat%20tour!';
const DIMITRIJ_URL =
  'https://wa.me/38268160664?text=Hi%2C%20I%27d%20like%20to%20book%20a%20speedboat%20tour!';

const WhatsAppIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function WhatsAppCTA() {
  const t = useTranslations('whatsappCta');

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #070c18 0%, #030710 100%)',
        padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,6vw,4rem)',
        textAlign: 'center',
        borderTop: '1px solid #1a2840',
        borderBottom: '1px solid #1a2840',
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#00b8d9',
            marginBottom: '1.25rem',
          }}
        >
          {t('eyebrow')}
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
            fontSize: 'clamp(2.8rem,6vw,4.5rem)',
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#dce8f5',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
          }}
        >
          {t('heading')}
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            fontSize: 'clamp(1rem,2vw,1.15rem)',
            color: '#7a90a8',
            maxWidth: 520,
            margin: '0 auto 3rem',
            lineHeight: 1.65,
          }}
        >
          {t('subtext')}
        </p>

        <div
          className="wa-buttons"
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          <style>{`
            @media(max-width:500px){.wa-buttons{flex-direction:column;align-items:stretch;}}
            .wa-btn{transition:transform 0.15s,box-shadow 0.15s;}
            .wa-btn:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(37,211,102,0.3);}
          `}</style>

          <a
            href={BOGDAN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: '#25D366',
              color: '#fff',
              padding: '1.1rem 2.2rem',
              borderRadius: 8,
              fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
            }}
          >
            <WhatsAppIcon />
            {t('bogdan')}
          </a>

          <a
            href={DIMITRIJ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: '#25D366',
              color: '#fff',
              padding: '1.1rem 2.2rem',
              borderRadius: 8,
              fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
            }}
          >
            <WhatsAppIcon />
            {t('dimitrij')}
          </a>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            fontSize: '0.82rem',
            color: '#4a607a',
            letterSpacing: '0.04em',
          }}
        >
          {t('available')}
        </p>
      </div>
    </section>
  );
}
