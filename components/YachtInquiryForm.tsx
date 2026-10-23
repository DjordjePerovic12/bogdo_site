'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DURATIONS, type YachtInquiryPayload } from '@/lib/yachtInquiry';

const CHAMPAGNE = '#c8b48a';
const SANS = 'var(--font-dm-sans, DM Sans, sans-serif)';
const SERIF = 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)';

type Errors = Partial<Record<keyof YachtInquiryPayload, string>>;

export default function YachtInquiryForm({ yachtSlug, maxGuests }: { yachtSlug: string; maxGuests: number }) {
  const t = useTranslations('yachts.form');
  const [form, setForm] = useState({
    date: '',
    duration: 'fullDay' as YachtInquiryPayload['duration'],
    guests: Math.min(4, maxGuests),
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [ref, setRef] = useState('');

  const today = new Date().toISOString().split('T')[0];

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!form.date) e.date = t('required');
    else if (form.date < today) e.date = t('pastDate');
    if (form.guests < 1 || form.guests > maxGuests) e.guests = t('maxGuests', { max: maxGuests });
    if (form.name.trim().length < 2) e.name = t('required');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = t('invalidEmail');
    if (form.phone.trim().length < 5) e.phone = t('required');
    return e;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/yacht-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, yachtSlug, notes: form.notes || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'failed');
      setRef(data.ref);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  const label: React.CSSProperties = {
    display: 'block',
    fontFamily: SANS,
    fontSize: '0.66rem',
    fontWeight: 500,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#7a90a8',
    marginBottom: '0.45rem',
  };
  const input = (err?: string): React.CSSProperties => ({
    width: '100%',
    padding: '11px 0',
    border: 'none',
    borderBottom: `1px solid ${err ? '#e05555' : '#24344f'}`,
    background: 'transparent',
    color: '#dce8f5',
    fontFamily: SANS,
    fontSize: '0.92rem',
    outline: 'none',
    borderRadius: 0,
    colorScheme: 'dark',
  });
  const errStyle: React.CSSProperties = { fontSize: '0.72rem', color: '#e05555', marginTop: 4 };

  if (status === 'done') {
    return (
      <div role="status" style={{ textAlign: 'left' }}>
        <div style={{ width: 36, height: 1, background: CHAMPAGNE, marginBottom: '1.25rem' }} />
        <h3 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: '2rem', color: '#f2f4f7', marginBottom: '0.75rem' }}>
          {t('successTitle')}
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#9aabbf', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          {t('successText', { ref })}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setForm((f) => ({ ...f, date: '', notes: '' }));
          }}
          style={{ background: 'none', border: 'none', color: CHAMPAGNE, fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', padding: 0 }}
        >
          {t('another')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="yi-date" style={label}>{t('fDate')}</label>
          <input id="yi-date" type="date" min={today} value={form.date} onChange={(e) => set('date', e.target.value)} style={input(errors.date)} aria-invalid={!!errors.date} />
          {errors.date && <p style={errStyle}>{errors.date}</p>}
        </div>
        <div>
          <label htmlFor="yi-guests" style={label}>{t('fGuests')}</label>
          <input
            id="yi-guests"
            type="number"
            min={1}
            max={maxGuests}
            value={form.guests}
            onChange={(e) => set('guests', Number(e.target.value))}
            style={input(errors.guests)}
            aria-invalid={!!errors.guests}
          />
          {errors.guests ? <p style={errStyle}>{errors.guests}</p> : <p style={{ ...errStyle, color: '#5d7088' }}>{t('maxGuests', { max: maxGuests })}</p>}
        </div>
      </div>

      <fieldset style={{ border: 'none' }}>
        <legend style={label}>{t('fDuration')}</legend>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {DURATIONS.map((d) => {
            const active = form.duration === d;
            return (
              <label
                key={d}
                className="yi-chip"
                style={{
                  position: 'relative',
                  flex: '1 1 auto',
                  textAlign: 'center',
                  padding: '8px 10px',
                  fontSize: '0.78rem',
                  border: `1px solid ${active ? CHAMPAGNE : '#24344f'}`,
                  color: active ? '#f2f4f7' : '#7a90a8',
                  cursor: 'pointer',
                  borderRadius: 2,
                  transition: 'border-color 0.3s, color 0.3s',
                }}
              >
                <input type="radio" name="duration" value={d} checked={active} onChange={() => set('duration', d)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                {t(d)}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="yi-name" style={label}>{t('fName')}</label>
        <input id="yi-name" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} style={input(errors.name)} aria-invalid={!!errors.name} />
        {errors.name && <p style={errStyle}>{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="yi-email" style={label}>{t('fEmail')}</label>
        <input id="yi-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} style={input(errors.email)} aria-invalid={!!errors.email} />
        {errors.email && <p style={errStyle}>{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="yi-phone" style={label}>{t('fPhone')}</label>
        <input id="yi-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} style={input(errors.phone)} aria-invalid={!!errors.phone} />
        {errors.phone && <p style={errStyle}>{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="yi-notes" style={label}>{t('fNotes')}</label>
        <textarea
          id="yi-notes"
          rows={2}
          maxLength={1000}
          placeholder={t('notesPh')}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          style={{ ...input(), resize: 'vertical' }}
        />
      </div>

      {status === 'error' && <p role="alert" style={{ ...errStyle, fontSize: '0.8rem' }}>{t('error')}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="yi-submit"
        style={{
          marginTop: '0.4rem',
          width: '100%',
          padding: '15px',
          background: CHAMPAGNE,
          color: '#0a0f1a',
          border: 'none',
          borderRadius: 2,
          fontFamily: SANS,
          fontSize: '0.78rem',
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          cursor: status === 'sending' ? 'wait' : 'pointer',
          opacity: status === 'sending' ? 0.7 : 1,
          transition: 'background 0.3s',
        }}
      >
        {status === 'sending' ? t('sending') : t('submit')}
      </button>
      <style>{`.yi-submit:hover:not(:disabled){background:#d8c69e !important} .yi-chip:focus-within{outline:1px solid ${CHAMPAGNE};outline-offset:2px}`}</style>
      <p style={{ fontSize: '0.72rem', color: '#5d7088', lineHeight: 1.6 }}>{t('privacy')}</p>
    </form>
  );
}
