'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const router = useRouter();
  const transparent = !scrolled && !mobileOpen;

  const navLinks = [
    { label: t('tours'), anchor: 'tours' },
    { label: t('yachts'), anchor: 'yachts' },
    { label: t('gallery'), anchor: 'gallery' },
    { label: t('about'), anchor: 'about' },
    { label: t('faq'), anchor: 'faq' },
    { label: t('contact'), anchor: 'contact' },
  ];

  function scrollTo(anchor: string) {
    setMobileOpen(false);
    const el = document.getElementById(anchor);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
    } else {
      router.push(`/#${anchor}`);
    }
  }

  return (
    <>
      <style>{`
        .nav-link:hover { color: #00b8d9 !important; }
        @media (min-width: 769px) { .hamburger-btn { display: none !important; } }
        @media (max-width: 768px) { .desktop-nav-links { display: none !important; } .nav-book-btn { display: none !important; } }
      `}</style>

      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 70,
          background: transparent ? 'transparent' : 'rgba(7,12,24,0.96)',
          backdropFilter: transparent ? 'none' : 'blur(14px)',
          WebkitBackdropFilter: transparent ? 'none' : 'blur(14px)',
          borderBottom: transparent ? 'none' : '1px solid #1a2840',
          transition: 'background 0.35s, border-color 0.35s',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 clamp(1.25rem, 5vw, 3rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          {/* Logo */}
          <Link href="/">
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  color: transparent ? '#fff' : '#dce8f5',
                  transition: 'color 0.3s',
                }}
              >
                Speed Boat Tour
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: transparent ? 'rgba(255,255,255,0.55)' : '#00b8d9',
                  transition: 'color 0.3s',
                }}
              >
                Kotor · Montenegro
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="desktop-nav-links" style={{ display: 'flex', gap: '2.25rem', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <button
                key={link.anchor}
                className="nav-link"
                onClick={() => scrollTo(link.anchor)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: transparent ? 'rgba(255,255,255,0.75)' : '#7a90a8',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="desktop-nav-links">
              <LanguageSwitcher variant="desktop" />
            </div>

            <Link href="/booking" className="nav-book-btn">
              <span
                style={{
                  display: 'inline-block',
                  background: '#00b8d9',
                  color: '#fff',
                  borderRadius: 4,
                  padding: '9px 20px',
                  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLSpanElement).style.background = '#0090aa')}
                onMouseLeave={(e) => ((e.target as HTMLSpanElement).style.background = '#00b8d9')}
              >
                {t('bookNow')}
              </span>
            </Link>

            {/* Hamburger */}
            <button
              className="hamburger-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    width: 22,
                    height: 1.5,
                    borderRadius: 2,
                    background: transparent ? '#fff' : '#dce8f5',
                    transition: 'all 0.3s',
                    transform: mobileOpen
                      ? i === 0
                        ? 'translateY(6.5px) rotate(45deg)'
                        : i === 2
                          ? 'translateY(-6.5px) rotate(-45deg)'
                          : 'scaleX(0)'
                      : 'none',
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            top: 70,
            background: '#030710',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.anchor}
              onClick={() => scrollTo(link.anchor)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                fontSize: '2.2rem',
                fontStyle: 'italic',
                fontWeight: 600,
                color: '#fff',
                padding: '0.6rem 2rem',
                width: '100%',
                textAlign: 'center',
              }}
            >
              {link.label}
            </button>
          ))}
          <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.15)', margin: '1rem 0' }} />
          <Link href="/booking" onClick={() => setMobileOpen(false)}>
            <span
              style={{
                display: 'inline-block',
                background: '#00b8d9',
                color: '#fff',
                borderRadius: 5,
                padding: '14px 40px',
                fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {t('bookNow')}
            </span>
          </Link>
          <div style={{ marginTop: '1.5rem' }}>
            <LanguageSwitcher variant="mobile" />
          </div>
        </div>
      )}
    </>
  );
}
