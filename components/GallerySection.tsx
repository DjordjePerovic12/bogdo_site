'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SectionLabel } from './ToursSection';

const IMAGES = [
  { src: '/images/gallery-1.jpg', alt: 'Speedboats at full speed on Boka Bay', span: 2, tall: true },
  { src: '/images/gallery-2.jpg', alt: 'Boat in crystal clear turquoise water', span: 1, tall: false },
  { src: '/images/gallery-3.jpg', alt: 'Perast church from the water', span: 1, tall: false },
  { src: '/images/gallery-4.jpg', alt: 'Guest enjoying the ride on Boka Bay', span: 1, tall: false },
  { src: '/images/gallery-5.jpg', alt: 'Sunset over the Adriatic', span: 1, tall: false },
  { src: '/images/gallery-6.jpg', alt: 'Cave entrance with turquoise water', span: 1, tall: false },
  { src: '/images/gallery-7.jpg', alt: 'Tall ship sailing Boka Bay', span: 2, tall: false },
  { src: '/images/gallery-8.jpg', alt: 'Speedboat docked on a sunny day', span: 1, tall: false },
  { src: '/images/gallery-9.jpg', alt: 'Sunset from the water', span: 1, tall: false },
  { src: '/images/gallery-10.jpg', alt: 'Boat speeding with Montenegro flag', span: 1, tall: false },
  { src: '/images/gallery-11.jpg', alt: 'Coastal cliffs and turquoise water', span: 1, tall: false },
  { src: '/images/gallery-12.jpg', alt: 'Speedboat on the bay', span: 1, tall: false },
  { src: '/images/gallery-13.jpg', alt: 'Boat at Perast marina', span: 1, tall: false },
];

export default function GallerySection() {
  const t = useTranslations('gallery');

  return (
    <section
      id="gallery"
      style={{ background: '#0a1220', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,4rem)' }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionLabel number={5} label={t('sectionLabel')} />
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

        <div
          className="gallery-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}
        >
          <style>{`@media(max-width:600px){.gallery-grid{grid-template-columns:repeat(2,1fr) !important;}}`}</style>
          {IMAGES.map((img, i) => (
            <div
              key={i}
              style={{
                borderRadius: 6,
                overflow: 'hidden',
                position: 'relative',
                minHeight: img.tall ? 280 : 180,
                gridColumn: img.span === 2 ? 'span 2' : 'span 1',
                background: '#0f1930',
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 960px) 33vw, 320px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
