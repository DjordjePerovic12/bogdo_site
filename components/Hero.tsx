'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Hero() {
  const t = useTranslations('hero');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: 'calc(100dvh - 0px)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#050d1a',
      }}
    >
      {/* Background photo */}
      <Image
        src="/images/hero.jpg"
        alt="Speedboat in Boka Bay, Montenegro"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center 40%', opacity: 0.45 }}
      />
      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(5,13,26,0.85) 0%, rgba(5,13,26,0.5) 60%, rgba(5,13,26,0.2) 100%)',
          zIndex: 1,
        }}
      />

      {/* Animated shimmer overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(0,184,217,0.12) 0%, transparent 70%)',
          animation: 'shimmer 8s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 50% 40% at 30% 70%, rgba(0,100,160,0.1) 0%, transparent 60%)',
          animation: 'shimmer 11s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Water lines */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.06 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
              top: `${20 + i * 6}%`,
              left: 0,
              right: 0,
              transform: `translateY(${scrollY * (0.05 + i * 0.01)}px)`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '0 clamp(1.5rem, 7vw, 6rem)',
          paddingTop: 120,
          paddingBottom: 80,
          maxWidth: 1100,
          width: '100%',
        }}
      >
        {/* Location label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            animation: 'fadeUp 1s ease both',
            animationDelay: '0.2s',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
            }}
          >
            {t('location')}
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(3.2rem, 9vw, 8rem)',
            fontWeight: 400,
            color: '#fff',
            lineHeight: 0.95,
            letterSpacing: '-0.01em',
            marginBottom: '1.5rem',
            animation: 'fadeUp 1s ease both',
            animationDelay: '0.4s',
          }}
        >
          {t('headline1')}
          <br />
          <em style={{ fontWeight: 600 }}>{t('headline2')}</em>
          <br />
          <span style={{ fontSize: '0.55em', fontWeight: 300, opacity: 0.8 }}>{t('headline3')}</span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 480,
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            whiteSpace: 'pre-line',
            animation: 'fadeUp 1s ease both',
            animationDelay: '0.6s',
          }}
        >
          {t('subheadline')}
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            animation: 'fadeUp 1s ease both',
            animationDelay: '0.8s',
          }}
        >
          <Link href="/booking">
            <span
              style={{
                display: 'inline-block',
                background: '#00b8d9',
                color: '#fff',
                border: 'none',
                borderRadius: 5,
                padding: '15px 32px',
                fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.2s',
                width: 'max-content',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#0090aa')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.background = '#00b8d9')}
            >
              {t('ctaPrimary')}
            </span>
          </Link>

          <button
            onClick={() => {
              const el = document.getElementById('tours');
              if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
            }}
            style={{
              background: 'transparent',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.35)',
              borderRadius: 5,
              padding: '15px 32px',
              fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              fontSize: '0.9rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.7)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.35)')}
          >
            {t('ctaSecondary')}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          opacity: 0.4,
          animation: 'fadeUp 1s ease both',
          animationDelay: '1.2s',
        }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: '#fff',
            textTransform: 'uppercase',
          }}
        >
          {t('scroll')}
        </span>
        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.5)' }} />
      </div>
    </section>
  );
}
