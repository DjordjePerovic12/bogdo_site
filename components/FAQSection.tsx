'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SectionLabel } from './ToursSection';

export default function FAQSection() {
  const t = useTranslations('faq');
  const items = t.raw('items') as Array<{ q: string; a: string }>;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,4rem)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SectionLabel number={6} label={t('sectionLabel')} />
        <h2
          style={{
            fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
            fontSize: 'clamp(2rem,4vw,3rem)',
            fontStyle: 'italic',
            fontWeight: 600,
            marginBottom: '2.5rem',
            color: '#dce8f5',
          }}
        >
          {t('heading')}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((faq, i) => (
            <div key={i} style={{ borderTop: '1px solid #1a2840' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '1.25rem 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  gap: '1rem',
                  minHeight: 44,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#dce8f5',
                    lineHeight: 1.4,
                  }}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    color: '#00b8d9',
                    fontSize: '1.2rem',
                    flexShrink: 0,
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                    display: 'inline-block',
                  }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div style={{ paddingBottom: '1.25rem', paddingRight: '2rem' }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                      fontSize: '0.875rem',
                      color: '#7a90a8',
                      lineHeight: 1.75,
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div style={{ borderTop: '1px solid #1a2840' }} />
        </div>
      </div>
    </section>
  );
}
