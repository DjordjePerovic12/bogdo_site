'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { YachtImage } from '@/lib/yachts';

export default function YachtGallery({ images }: { images: YachtImage[] }) {
  const t = useTranslations('yachts');
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    triggerRef.current?.focus();
  }, []);
  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, step]);

  const navBtn: React.CSSProperties = {
    background: 'rgba(7,12,24,0.6)',
    border: '1px solid rgba(200,180,138,0.35)',
    color: '#dce8f5',
    width: 48,
    height: 48,
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <>
      <style>{`
        .yg-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: clamp(140px, 18vw, 220px); grid-auto-flow: dense; gap: 10px; }
        .yg-item { position: relative; overflow: hidden; border: 0; padding: 0; background: #0a1220; cursor: zoom-in; border-radius: 2px; }
        .yg-item:nth-child(6n+1) { grid-column: span 2; grid-row: span 2; }
        .yg-item:nth-child(6n+5) { grid-column: span 2; grid-row: span 2; }
        .yg-item img { transition: transform 1.2s cubic-bezier(.2,.6,.2,1), opacity 0.4s; }
        .yg-item:hover img { transform: scale(1.03); }
        .yg-item:focus-visible { outline: 1px solid #c8b48a; outline-offset: 3px; }
        @media (max-width: 640px) {
          .yg-grid { grid-template-columns: 1fr 1fr; grid-auto-rows: 38vw; }
          .yg-item:nth-child(6n+1), .yg-item:nth-child(6n+5) { grid-row: span 1; }
          .yg-item:nth-child(3n+1) { grid-column: span 2; grid-row: span 1; }
        }
        @media (prefers-reduced-motion: reduce) { .yg-item img { transition: none; } }
      `}</style>

      <div className="yg-grid">
        {images.map((im, i) => (
          <button
            key={im.src}
            type="button"
            className="yg-item"
            aria-label={`${im.alt} — ${t('photoOf', { n: i + 1, total: images.length })}`}
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setOpen(i);
            }}
          >
            <Image
              src={im.src}
              alt={im.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1100px) 66vw, 720px"
              style={{ objectFit: 'cover' }}
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={images[open].alt}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(3,7,16,0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(3.5rem,6vw,5rem) clamp(0.5rem,5vw,5rem)',
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: 1400 }} onClick={close}>
            <Image key={images[open].src} src={images[open].src} alt={images[open].alt} fill sizes="100vw" style={{ objectFit: 'contain' }} />
          </div>

          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 20,
              right: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#9aabbf',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
            }}
          >
            <span aria-live="polite">
              {t('photoOf', { n: open + 1, total: images.length })} · {images[open].alt}
            </span>
            <button ref={closeRef} type="button" onClick={close} aria-label={t('close')} style={navBtn}>
              ×
            </button>
          </div>

          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={t('prev')}
            style={{ ...navBtn, position: 'absolute', left: 'clamp(8px,2vw,24px)', top: '50%', transform: 'translateY(-50%)' }}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={t('next')}
            style={{ ...navBtn, position: 'absolute', right: 'clamp(8px,2vw,24px)', top: '50%', transform: 'translateY(-50%)' }}
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
