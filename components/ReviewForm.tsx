'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ReviewForm() {
  const t = useTranslations('review');
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!name.trim() || !text.trim() || rating === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), text: text.trim(), rating }),
      });
      const data = await res.json();
      setStep(data.success ? 'success' : 'error');
    } catch {
      setStep('error');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 6,
    border: '1.5px solid #1a2840',
    background: '#0d1525',
    color: '#dce8f5',
    fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#7a90a8',
    marginBottom: '0.5rem',
  };

  if (step === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: '#00b8d9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', fontSize: '2rem', color: '#fff',
        }}>✓</div>
        <h2 style={{
          fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
          fontSize: '2rem', fontStyle: 'italic', fontWeight: 600,
          color: '#dce8f5', marginBottom: '0.75rem',
        }}>{t('successTitle')}</h2>
        <p style={{ color: '#7a90a8', fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)', fontSize: '0.95rem' }}>
          {t('successBody')}
        </p>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: '#e05555' }}>{t('errorMsg')}</p>
        <button onClick={() => setStep('form')} style={{
          marginTop: '1rem', background: '#00b8d9', color: '#fff',
          border: 'none', borderRadius: 6, padding: '10px 24px',
          cursor: 'pointer', fontWeight: 600,
        }}>{t('tryAgain')}</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Star rating */}
      <div>
        <label style={labelStyle}>{t('ratingLabel')} *</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                fontSize: '2.2rem', lineHeight: 1,
                color: star <= (hover || rating) ? '#e0a020' : '#1a2840',
                transition: 'color 0.15s, transform 0.1s',
                transform: star <= (hover || rating) ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label style={labelStyle}>{t('nameLabel')} *</label>
        <input
          type="text"
          placeholder={t('namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Testimonial */}
      <div>
        <label style={labelStyle}>{t('textLabel')} *</label>
        <textarea
          placeholder={t('textPlaceholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
        />
      </div>

      <button
        onClick={submit}
        disabled={loading || !name.trim() || !text.trim() || rating === 0}
        style={{
          background: rating && name.trim() && text.trim() ? '#00b8d9' : '#1a2840',
          color: '#fff', border: 'none', borderRadius: 6,
          padding: '14px 32px', fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em',
          textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer',
          transition: 'background 0.2s', alignSelf: 'flex-start',
        }}
      >
        {loading ? t('submitting') : t('submit')}
      </button>
    </div>
  );
}
