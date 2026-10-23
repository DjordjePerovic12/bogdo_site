'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Tour } from '@/lib/tours';

export default function TourCard({ tour }: { tour: Tour }) {
  const t = useTranslations('tours');
  const [hovered, setHovered] = useState(false);
  const isPrivate = tour.type === 'private';

  return (
    <Link href={`/tours/${tour.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'row',
        background: '#0f1930',
        border: '1px solid #1a2840',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.25s, box-shadow 0.25s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.4)' : '0 2px 16px rgba(0,0,0,0.2)',
      }}
      className="tour-card-wrap"
    >
      <style>{`
        @media (max-width: 700px) {
          .tour-card-wrap { flex-direction: column !important; }
          .tour-card-img { width: 100% !important; min-height: 180px !important; }
        }
      `}</style>

      {/* Image panel */}
      <div
        className="tour-card-img"
        style={{
          width: '38%',
          minHeight: 220,
          flexShrink: 0,
          position: 'relative',
          background: `linear-gradient(135deg, ${tour.gradientFrom} 0%, ${tour.gradientTo} 100%)`,
          overflow: 'hidden',
        }}
      >
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          sizes="(max-width: 700px) 100vw, 38vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.15), rgba(0,0,0,0))',
          }}
        />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tour.popular && (
            <span
              style={{
                background: '#e0a020',
                color: '#fff',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 3,
              }}
            >
              {t('popular')}
            </span>
          )}
        </div>
      </div>

      {/* Content panel */}
      <div
        style={{
          flex: 1,
          padding: '1.6rem 1.8rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: isPrivate ? '#e0a020' : '#00b8d9',
                border: `1px solid ${isPrivate ? '#e0a020' : '#00b8d9'}`,
                borderRadius: 3,
                padding: '2px 8px',
              }}
            >
              {isPrivate ? t('privateTour') : t('smallGroup')}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#7a90a8' }}>
              · {tour.duration}
            </span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
              fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: '0.4rem',
              color: '#dce8f5',
            }}
          >
            {tour.name}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              fontSize: '0.85rem',
              color: '#7a90a8',
              lineHeight: 1.6,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {tour.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tour.highlights.slice(0, 3).map((h, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.7rem',
                  color: '#7a90a8',
                  background: '#0a1220',
                  padding: '3px 10px',
                  borderRadius: 20,
                }}
              >
                {h}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #1a2840',
          }}
        >
          <div>
            <span style={{ fontSize: '0.7rem', color: '#7a90a8', display: 'block', marginBottom: 2 }}>
              {t('startingFrom')}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#00b8d9',
              }}
            >
              {tour.price}
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 400,
                  color: '#7a90a8',
                  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                }}
              >
                {' '}
                /{isPrivate ? t('perBoat') : t('perPerson')}
              </span>
            </span>
          </div>

          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#00b8d9',
              fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            {t('viewTour')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
    </Link>
  );
}
