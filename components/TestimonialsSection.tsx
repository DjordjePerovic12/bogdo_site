'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SectionLabel } from './ToursSection';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
}

const PREVIEW_COUNT = 4;

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ color: '#e0a020', fontSize: '1rem', letterSpacing: 2 }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </div>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div style={{
      background: '#0f1930', border: '1px solid #1a2840', borderRadius: 8,
      padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
    }}>
      <StarRating rating={item.rating} />
      <p style={{
        fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
        fontSize: '0.88rem', color: '#7a90a8', lineHeight: 1.7,
        fontStyle: 'italic', flex: 1, margin: 0,
      }}>
        &ldquo;{item.text}&rdquo;
      </p>
      <div style={{
        fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
        fontSize: '0.8rem', fontWeight: 600, color: '#dce8f5',
        borderTop: '1px solid #1a2840', paddingTop: '0.75rem',
      }}>
        {item.name}
        <span style={{ color: '#4a607a', fontWeight: 400, marginLeft: 8 }}>
          {new Date(item.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

function Modal({ items, onClose, closeLabel }: { items: Testimonial[]; onClose: () => void; closeLabel: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(3,7,16,0.85)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: 'clamp(1rem,4vw,3rem)',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0d1525', border: '1px solid #1a2840', borderRadius: 12,
          width: '100%', maxWidth: 780, padding: 'clamp(1.5rem,4vw,2.5rem)',
          marginTop: 'auto', marginBottom: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
            fontSize: 'clamp(1.5rem,3vw,2rem)', fontStyle: 'italic', fontWeight: 600,
            color: '#dce8f5', margin: 0,
          }}>
            {items.length} {closeLabel === 'Close' ? 'guest reviews' : closeLabel === 'Schließen' ? 'Gästebewertungen' : 'reviews'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '1px solid #1a2840', color: '#7a90a8',
              borderRadius: 6, padding: '6px 14px', cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)', fontSize: '0.82rem',
            }}
          >
            {closeLabel} ✕
          </button>
        </div>
        <div
          className="modal-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}
        >
          <style>{`@media(max-width:560px){.modal-grid{grid-template-columns:1fr !important;}}`}</style>
          {items.map((item) => <TestimonialCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const t = useTranslations('testimonials');
  const [items, setItems] = useState<Testimonial[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((d) => setItems(d.testimonials || []));
  }, []);

  if (items.length === 0) return null;

  // Newest first, show only PREVIEW_COUNT
  const sorted = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const preview = sorted.slice(0, PREVIEW_COUNT);
  const hasMore = items.length > PREVIEW_COUNT;

  return (
    <>
      <section
        id="testimonials"
        style={{ background: '#070c18', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,4rem)', borderTop: '1px solid #1a2840' }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <SectionLabel number={7} label={t('sectionLabel')} />
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
              fontSize: 'clamp(2rem,4vw,3rem)', fontStyle: 'italic', fontWeight: 600,
              color: '#dce8f5', margin: 0,
            }}>
              {t('heading')}
            </h2>
            {hasMore && (
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  background: 'none', border: '1px solid #1a2840', color: '#00b8d9',
                  borderRadius: 6, padding: '8px 18px', cursor: 'pointer',
                  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                  fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#00b8d9')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1a2840')}
              >
                {t('seeAll')} ({items.length}) →
              </button>
            )}
          </div>

          <div
            className="testimonials-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}
          >
            <style>{`
              @media(max-width:900px){.testimonials-grid{grid-template-columns:repeat(2,1fr) !important;}}
              @media(max-width:500px){.testimonials-grid{grid-template-columns:1fr !important;}}
            `}</style>
            {preview.map((item) => <TestimonialCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {modalOpen && (
        <Modal items={sorted} onClose={() => setModalOpen(false)} closeLabel={t('close')} />
      )}
    </>
  );
}
