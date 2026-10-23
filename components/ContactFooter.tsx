'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function ContactFooter() {
  const t = useTranslations();

  return (
    <footer id="contact" style={{ background: '#030710', color: '#dce8f5', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,4rem) 2rem' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          <style>{`@media(max-width:700px){.footer-grid{grid-template-columns:1fr !important;}}`}</style>

          {/* Brand */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                fontSize: '1.3rem',
                fontWeight: 600,
                marginBottom: 4,
                color: '#fff',
              }}
            >
              Speed Boat Tour
            </p>
            <p
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                color: '#00b8d9',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              Kotor · Montenegro
            </p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              {t('footer.tagline')}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '1rem',
              }}
            >
              {t('footer.contactHeading')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <a
                href="mailto:boattourskotor1@gmail.com"
                style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
              >
                <span style={{ fontSize: '0.8rem', marginTop: 2 }}>✉</span>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  boattourskotor1@gmail.com
                </span>
              </a>
              <a
                href="tel:+38268620177"
                style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
              >
                <span style={{ fontSize: '0.8rem', marginTop: 2 }}>📱</span>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  +382 68 620 177
                </span>
              </a>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', marginTop: 2 }}>📍</span>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  Kotor, Boka Bay, Montenegro
                </span>
              </div>
            </div>
            <a
              href="https://wa.me/38268620177"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: '1.25rem',
                background: '#25D366',
                color: '#fff',
                borderRadius: 5,
                padding: '10px 18px',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t('contact.whatsappBtn')}
            </a>
          </div>

          {/* Quick links */}
          <div>
            <p
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '1rem',
              }}
            >
              {t('footer.quickLinksHeading')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: t('footer.groupTours'), href: '/#tours' },
                { label: t('footer.privateTours'), href: '/#tours' },
                { label: t('footer.about'), href: '/#about' },
                { label: t('footer.faq'), href: '/#faq' },
                { label: t('footer.bookNow'), href: '/booking' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href as '/'}
                  style={{
                    fontSize: '0.82rem',
                    color: 'rgba(255,255,255,0.5)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = '#00b8d9')}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="footer-bottom"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <style>{`@media(max-width:600px){.footer-bottom{flex-direction:column;align-items:center;text-align:center;}}`}</style>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
            {t('footer.copyright')}
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link
              href="/terms-conditions"
              style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}
            >
              {t('footer.terms')}
            </Link>
            <Link
              href="/privacy-policy"
              style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}
            >
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
