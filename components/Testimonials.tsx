'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { SectionLabel } from './ToursSection';

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const items = t.raw('items') as Array<{
    name: string;
    country: string;
    flag: string;
    rating: number;
    text: string;
    tour: string;
  }>;

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActive((a) => (a + 1) % items.length), 4500);
    return () => clearInterval(interval);
  }, [items.length]);

  const r = items[active];

  return (
    <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,4rem)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionLabel number={4} label={t('sectionLabel')} />
        <div className="testimonial-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <style>{`@media(max-width:700px){.testimonial-grid{grid-template-columns:1fr !important;gap:2rem !important;}}`}</style>

          {/* Quote */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                fontSize: '6rem',
                lineHeight: 0.7,
                color: '#00b8d9',
                opacity: 0.2,
                marginBottom: '1rem',
              }}
            >
              &ldquo;
            </div>
            <blockquote
              key={active}
              style={{
                fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                fontSize: 'clamp(1.2rem,2.5vw,1.6rem)',
                fontStyle: 'italic',
                lineHeight: 1.4,
                color: '#dce8f5',
                marginBottom: '1.5rem',
                animation: 'fadeIn 0.5s ease',
              }}
            >
              {r.text}
            </blockquote>
            <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.6rem' }}>
              {Array.from({ length: r.rating }).map((_, i) => (
                <span key={i} style={{ color: '#e0a020', fontSize: '0.9rem' }}>★</span>
              ))}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#dce8f5',
              }}
            >
              {r.name}{' '}
              <span style={{ color: '#7a90a8', fontWeight: 400 }}>· {r.country}</span>
            </p>
            <p style={{ fontSize: '0.75rem', color: '#00b8d9', marginTop: 4 }}>{r.tour}</p>
          </div>

          {/* Reviewer list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map((rev, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  background: i === active ? '#0f1930' : 'transparent',
                  border: `1px solid ${i === active ? '#00b8d9' : '#1a2840'}`,
                  borderRadius: 6,
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.8rem' }}>{rev.flag}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#dce8f5',
                    }}
                  >
                    {rev.name}
                  </span>
                  <span style={{ color: '#e0a020', fontSize: '0.7rem' }}>
                    {'★'.repeat(rev.rating)}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                    fontSize: '0.75rem',
                    color: '#7a90a8',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {rev.text}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
