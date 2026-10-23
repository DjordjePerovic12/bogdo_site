'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { TOURS } from '@/lib/tours';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Default flag + dial code shown in the country picker, per site locale.
const DEFAULT_PHONE_COUNTRY: Record<string, string> = {
  me: 'me',
  ru: 'ru',
  de: 'de',
  es: 'es',
  fr: 'fr',
  en: 'me',
};
const DEFAULT_PHONE_DIAL_CODE: Record<string, string> = {
  me: '382',
  ru: '7',
  de: '49',
  es: '34',
  fr: '33',
  en: '382',
};

interface FormState {
  tourSlug: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  requests: string;
  referralSource: string;
  agreed: boolean;
}

const today = new Date().toISOString().split('T')[0];

// Renders directly into the pre-opened WhatsApp handoff tab so it never shows
// a blank about:blank page while the booking request is in flight.
function writeWaLoadingScreen(win: Window) {
  win.document.open();
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Confirming your booking…</title>
  <style>
    html,body{margin:0;height:100%;background:#070c18;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}
    .wrap{text-align:center;color:#dce8f5;}
    .spinner{width:40px;height:40px;border:3px solid #1a2840;border-top-color:#00b8d9;border-radius:50%;margin:0 auto 1.25rem;animation:spin 0.8s linear infinite;}
    @keyframes spin{to{transform:rotate(360deg);}}
    p{font-size:0.95rem;color:#7a90a8;}
  </style></head>
  <body><div class="wrap"><div class="spinner"></div><p>Confirming your booking…</p></div></body></html>`);
  win.document.close();
}

function writeWaSuccessScreen(
  win: Window,
  opts: { tourName: string; date: string; time: string; guests: number; ref: string }
) {
  win.document.open();
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Booking Confirmed</title>
  <style>
    html,body{margin:0;min-height:100%;background:#070c18;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:2rem;box-sizing:border-box;}
    .card{text-align:center;max-width:360px;}
    .check{width:64px;height:64px;border-radius:50%;background:#22c55e;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;color:#fff;font-size:1.6rem;}
    h1{color:#dce8f5;font-size:1.5rem;margin:0 0 1rem;}
    .box{background:#0a1220;border-radius:8px;padding:1rem 1.25rem;text-align:left;margin-bottom:1rem;}
    .row{display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid #1a2840;font-size:0.85rem;}
    .row:last-child{border-bottom:none;}
    .label{color:#7a90a8;}
    .val{color:#dce8f5;font-weight:600;}
    .note{color:#7a90a8;font-size:0.85rem;}
  </style></head>
  <body><div class="card">
    <div class="check">✓</div>
    <h1>Booking Confirmed!</h1>
    <div class="box">
      <div class="row"><span class="label">Reference</span><span class="val">${opts.ref}</span></div>
      <div class="row"><span class="label">Tour</span><span class="val">${opts.tourName}</span></div>
      <div class="row"><span class="label">Date</span><span class="val">${opts.date}</span></div>
      <div class="row"><span class="label">Time</span><span class="val">${opts.time}</span></div>
      <div class="row"><span class="label">Guests</span><span class="val">${opts.guests}</span></div>
    </div>
    <p class="note">Opening WhatsApp…</p>
  </div></body></html>`);
  win.document.close();
}

export default function BookingForm({ initialTourSlug, referrers = [] }: { initialTourSlug?: string; referrers?: string[] }) {
  const t = useTranslations('booking');
  const locale = useLocale();
  const defaultPhoneCountry = DEFAULT_PHONE_COUNTRY[locale] || 'me';
  const defaultPhoneValue = '+' + (DEFAULT_PHONE_DIAL_CODE[locale] || '382');
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form');
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [form, setForm] = useState<FormState>({
    tourSlug: initialTourSlug || '',
    date: '',
    time: '09:00',
    guests: 2,
    name: '',
    lastName: '',
    email: '',
    phone: defaultPhoneValue,
    requests: '',
    referralSource: '',
    agreed: false,
  });

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const touchField = (key: keyof FormState) => {
    setTouched((t) => ({ ...t, [key]: true }));
  };

  const groupTours = TOURS.filter((t) => t.type === 'group');
  const privateTours = TOURS.filter((t) => t.type === 'private');
  const selectedTour = TOURS.find((t) => t.slug === form.tourSlug);

  const times = selectedTour?.type === 'private'
    ? ['09:00', '12:00', '15:00', '18:00', t('fields.flexible')]
    : ['09:00', '12:00', '15:00', '18:00'];

  // Always-current validation result — pure function of form state
  const errors = useMemo((): Partial<Record<keyof FormState, string>> => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.tourSlug) e.tourSlug = t('validation.tourRequired');
    if (!form.date) e.date = t('validation.dateRequired');
    else if (new Date(form.date) < new Date(today)) e.date = t('validation.datePast');
    if (!form.name.trim() || form.name.trim().length < 2) e.name = t('validation.nameMin');
    if (!form.lastName.trim()) e.lastName = t('validation.lastNameRequired');
    if (!form.email.trim()) e.email = t('validation.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('validation.emailInvalid');
    if (form.phone.replace(/\D/g, '').length < 7) e.phone = t('validation.phoneRequired');
    if (!form.agreed) e.agreed = t('validation.termsRequired');
    return e;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const isFormValid = Object.keys(errors).length === 0;

  // Show a field's error only after it has been touched or submit was attempted
  function fieldError(key: keyof FormState): string | undefined {
    return (touched[key] || submitAttempted) ? errors[key] : undefined;
  }

  async function submit() {
    setSubmitAttempted(true);
    if (!isFormValid) return;

    // Opened synchronously (before any await) so it isn't blocked as a popup —
    // navigated to the real WhatsApp link once the booking succeeds.
    const waWindow = window.open('', '_blank');
    if (waWindow) writeWaLoadingScreen(waWindow);

    setLoading(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          agreed: true,
          referralSource: form.referralSource || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingRef(data.bookingRef);
        setStep('success');

        const formattedDate = form.date
          ? new Date(form.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          : form.date;
        const tourName = selectedTour?.name ?? '';
        const message = `Hello, Bogdan! We have just booked ${tourName} for ${formattedDate} at ${form.time}, for ${form.guests} guest(s).`;
        const url = `https://wa.me/38268620177?text=${encodeURIComponent(message)}`;
        setWhatsappUrl(url);
        // Brief delay so the customer sees a confirmation (booking ref, summary)
        // before the browser hands off to WhatsApp.
        if (waWindow) {
          writeWaSuccessScreen(waWindow, {
            tourName,
            date: formattedDate,
            time: form.time,
            guests: form.guests,
            ref: data.bookingRef,
          });
          setTimeout(() => {
            waWindow.location.href = url;
          }, 400);
        } else {
          window.open(url, '_blank');
        }
      } else {
        waWindow?.close();
        setStep('error');
      }
    } catch {
      waWindow?.close();
      setStep('error');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (hasError?: string): React.CSSProperties => ({
    width: '100%',
    padding: '12px 14px',
    borderRadius: 5,
    border: `1.5px solid ${hasError ? '#e05555' : '#1a2840'}`,
    background: '#0d1525',
    color: '#dce8f5',
    fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  });

  // Same look as inputStyle, but with room on the left for the flag/dial-code button.
  const phoneInputStyle = (hasError?: string): React.CSSProperties => ({
    ...inputStyle(hasError),
    width: '100%',
    height: 44,
    padding: '12px 14px 12px 56px',
  });

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

  const errStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#e05555',
    marginTop: 4,
    fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
  };

  // ── Success ──────────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '1.8rem',
              color: '#fff',
            }}
          >
            ✓
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
              fontSize: '2.5rem',
              fontStyle: 'italic',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: '#dce8f5',
            }}
          >
            {t('success.title')}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#7a90a8', marginBottom: '1.5rem' }}>
            {t('success.emailSent')}
          </p>

          <div
            style={{
              background: '#0a1220',
              borderRadius: 8,
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#7a90a8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {t('success.refLabel')}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                fontSize: '1.8rem',
                fontWeight: 600,
                color: '#00b8d9',
                letterSpacing: '0.08em',
              }}
            >
              {bookingRef}
            </div>
          </div>

          <div
            style={{
              background: '#0a1220',
              borderRadius: 8,
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              textAlign: 'left',
            }}
          >
            {[
              { label: t('success.summaryTour'), val: selectedTour?.name },
              { label: t('success.summaryDate'), val: form.date },
              { label: t('success.summaryTime'), val: form.time },
              { label: t('success.summaryGuests'), val: String(form.guests) },
              { label: t('success.summaryContact'), val: form.email },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.4rem 0',
                  borderBottom: '1px solid #1a2840',
                  fontSize: '0.82rem',
                }}
              >
                <span style={{ color: '#7a90a8' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: '#dce8f5' }}>{row.val}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: '#0a1220',
              borderRadius: 8,
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}
          >
            <p style={{ fontSize: '0.82rem', color: '#7a90a8', lineHeight: 1.6 }}>
              📱 {t('success.whatsappNote')}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#7a90a8', lineHeight: 1.6 }}>
              💳 {t('success.paymentNote')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: '#25D366',
                  color: '#fff',
                  borderRadius: 5,
                  padding: '12px 24px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Open WhatsApp
              </a>
            )}
            <Link href="/">
              <span
                style={{
                  display: 'inline-block',
                  background: '#00b8d9',
                  color: '#fff',
                  borderRadius: 5,
                  padding: '12px 24px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                {t('success.backHome')}
              </span>
            </Link>
            <button
              onClick={() => {
                setStep('form');
                setSubmitAttempted(false);
                setTouched({});
                setForm({
                  tourSlug: '',
                  date: '',
                  time: '09:00',
                  guests: 2,
                  name: '',
                  lastName: '',
                  email: '',
                  phone: defaultPhoneValue,
                  requests: '',
                  referralSource: '',
                  agreed: false,
                });
              }}
              style={{
                background: 'transparent',
                border: '1.5px solid #1a2840',
                color: '#dce8f5',
                borderRadius: 5,
                padding: '12px 24px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              {t('success.bookAnother')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (step === 'error') {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 460 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#e05555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '1.8rem',
              color: '#fff',
            }}
          >
            !
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
              fontSize: '2rem',
              fontStyle: 'italic',
              fontWeight: 600,
              marginBottom: '0.75rem',
              color: '#dce8f5',
            }}
          >
            {t('error.title')}
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#7a90a8', lineHeight: 1.7, marginBottom: '0.5rem' }}>
            {t('error.body')}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#7a90a8', marginBottom: '1.5rem' }}>
            If the problem persists, contact us directly:
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStep('form')}
              style={{
                background: '#00b8d9',
                color: '#fff',
                border: 'none',
                borderRadius: 5,
                padding: '12px 24px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              {t('error.tryAgain')}
            </button>
            <a
              href="https://wa.me/38268620177"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#25D366',
                color: '#fff',
                borderRadius: 5,
                padding: '12px 24px',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'inline-block',
              }}
            >
              {t('error.whatsappBtn')}
            </a>
            <a
              href="mailto:boattourskotor1@gmail.com"
              style={{
                background: 'transparent',
                border: '1.5px solid #1a2840',
                color: '#dce8f5',
                borderRadius: 5,
                padding: '12px 24px',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'inline-block',
              }}
            >
              {t('error.emailBtn')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(2rem,5vw,3.5rem) clamp(1.5rem,6vw,2rem)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Tour select */}
        <div>
          <label style={labelStyle}>{t('fields.tourLabel')} *</label>
          <select
            value={form.tourSlug}
            onChange={(e) => setField('tourSlug', e.target.value)}
            onBlur={() => touchField('tourSlug')}
            style={{ ...inputStyle(fieldError('tourSlug')), cursor: 'pointer' }}
          >
            <option value="">{t('fields.tourPlaceholder')}</option>
            <optgroup label={t('fields.groupToursLabel')}>
              {groupTours.map((tour) => (
                <option key={tour.slug} value={tour.slug}>
                  {tour.name} — {tour.price}/{t('tours.perPerson')}
                </option>
              ))}
            </optgroup>
            <optgroup label={t('fields.privateToursLabel')}>
              {privateTours.map((tour) => (
                <option key={tour.slug} value={tour.slug}>
                  {tour.name} — {tour.price}/{t('tours.perBoat')}
                </option>
              ))}
            </optgroup>
          </select>
          {fieldError('tourSlug') && <p style={errStyle}>{fieldError('tourSlug')}</p>}
        </div>

        {/* Date + Time */}
        <div
          className="dt-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
        >
          <style>{`@media(max-width:500px){.dt-grid{grid-template-columns:1fr !important;}}`}</style>
          <div>
            <label style={labelStyle}>{t('fields.dateLabel')} *</label>
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
              onBlur={() => touchField('date')}
              style={inputStyle(fieldError('date'))}
            />
            {fieldError('date') && <p style={errStyle}>{fieldError('date')}</p>}
          </div>
          <div>
            <label style={labelStyle}>{t('fields.timeLabel')}</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {times.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setField('time', time)}
                  style={{
                    padding: '10px 14px',
                    border: `1.5px solid ${form.time === time ? '#00b8d9' : '#1a2840'}`,
                    borderRadius: 5,
                    background: form.time === time ? '#00b8d9' : 'transparent',
                    color: form.time === time ? '#fff' : '#7a90a8',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    flex: 1,
                    minWidth: 60,
                    minHeight: 44,
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Guests */}
        <div>
          <label style={labelStyle}>{t('fields.guestsLabel')} *</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setField('guests', Math.max(1, form.guests - 1))}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: '1.5px solid #1a2840',
                background: '#0d1525',
                color: '#dce8f5',
                fontSize: '1.2rem',
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              −
            </button>
            <span
              style={{
                fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                fontSize: '1.8rem',
                fontWeight: 600,
                color: '#dce8f5',
                minWidth: 32,
                textAlign: 'center',
              }}
            >
              {form.guests}
            </span>
            <button
              type="button"
              onClick={() => setField('guests', Math.min(12, form.guests + 1))}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: '1.5px solid #1a2840',
                background: '#0d1525',
                color: '#dce8f5',
                fontSize: '1.2rem',
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              +
            </button>
            <span style={{ fontSize: '0.8rem', color: '#7a90a8', lineHeight: 1.4 }}>
              {t('fields.maxNote')} 12 · {t('fields.largeGroupNote')}
            </span>
          </div>
        </div>

        {/* Name + Last Name */}
        <div className="name-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <style>{`@media(max-width:500px){.name-grid{grid-template-columns:1fr !important;}}`}</style>
          <div>
            <label style={labelStyle}>{t('fields.nameLabel')} *</label>
            <input
              type="text"
              placeholder={t('fields.namePlaceholder')}
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              onBlur={() => touchField('name')}
              style={inputStyle(fieldError('name'))}
            />
            {fieldError('name') && <p style={errStyle}>{fieldError('name')}</p>}
          </div>
          <div>
            <label style={labelStyle}>{t('fields.lastNameLabel')} *</label>
            <input
              type="text"
              placeholder={t('fields.lastNamePlaceholder')}
              value={form.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
              onBlur={() => touchField('lastName')}
              style={inputStyle(fieldError('lastName'))}
            />
            {fieldError('lastName') && <p style={errStyle}>{fieldError('lastName')}</p>}
          </div>
        </div>

        {/* Email + Phone */}
        <div
          className="ep-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
        >
          <style>{`@media(max-width:500px){.ep-grid{grid-template-columns:1fr !important;}}`}</style>
          <div>
            <label style={labelStyle}>{t('fields.emailLabel')} *</label>
            <input
              type="email"
              placeholder={t('fields.emailPlaceholder')}
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              onBlur={() => touchField('email')}
              style={inputStyle(fieldError('email'))}
            />
            {fieldError('email') && <p style={errStyle}>{fieldError('email')}</p>}
          </div>
          <div>
            <label style={labelStyle}>{t('fields.phoneLabel')} *</label>
            <PhoneInput
              country={defaultPhoneCountry}
              value={form.phone}
              onChange={(_value, _country, _event, formattedValue) => setField('phone', formattedValue)}
              onBlur={() => touchField('phone')}
              placeholder={t('fields.phonePlaceholder')}
              enableSearch
              disableSearchIcon
              countryCodeEditable={false}
              masks={{
                me: '.. ... ...',
                rs: '.. ... ....',
                hr: '.. ... ....',
                ba: '.. ... ...',
                al: '.. ... ....',
                xk: '.. ... ...',
              }}
              searchPlaceholder={t('fields.phoneSearchPlaceholder')}
              inputProps={{ name: 'phone' }}
              containerStyle={{ width: '100%' }}
              inputStyle={phoneInputStyle(fieldError('phone'))}
              buttonStyle={{
                background: '#0d1525',
                borderTop: `1.5px solid ${fieldError('phone') ? '#e05555' : '#1a2840'}`,
                borderBottom: `1.5px solid ${fieldError('phone') ? '#e05555' : '#1a2840'}`,
                borderLeft: `1.5px solid ${fieldError('phone') ? '#e05555' : '#1a2840'}`,
                borderRight: 'none',
                borderRadius: '5px 0 0 5px',
                width: 48,
              }}
              dropdownStyle={{
                background: '#0d1525',
                border: '1.5px solid #1a2840',
                color: '#dce8f5',
                fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              }}
            />
            <style>{`
              .react-tel-input .country-list { background: #0d1525; }
              .react-tel-input .country-list .country-name { color: #dce8f5; }
              .react-tel-input .country-list .dial-code { color: #7a90a8; }
              .react-tel-input .country-list .country:hover,
              .react-tel-input .country-list .country.highlight { background-color: #142238; }
              .react-tel-input .country-list .divider { border-bottom-color: #1a2840; }
              .react-tel-input .country-list .no-entries-message { color: #7a90a8; }
              .react-tel-input .selected-flag:hover,
              .react-tel-input .selected-flag:focus,
              .react-tel-input .flag-dropdown.open .selected-flag { background-color: #142238; }
              .react-tel-input .country-list .search {
                background: #0d1525;
                padding: 10px;
                border-bottom: 1px solid #1a2840;
              }
              .react-tel-input .search-box {
                width: 100% !important;
                margin-left: 0 !important;
                padding: 8px 10px 8px 32px !important;
                background: #0a1220 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237a90a8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E") no-repeat 8px center;
                background-size: 14px 14px;
                border: 1.5px solid #1a2840 !important;
                border-radius: 5px !important;
                color: #dce8f5;
                font-family: var(--font-dm-sans, DM Sans, sans-serif);
              }
              .react-tel-input .search-box::placeholder { color: #5a7290; }
            `}</style>
            {fieldError('phone') && <p style={errStyle}>{fieldError('phone')}</p>}
            <p style={{ fontSize: '0.72rem', color: '#7a90a8', marginTop: 4 }}>{t('fields.phoneHint')}</p>
          </div>
        </div>

        {/* Special requests */}
        <div>
          <label style={labelStyle}>
            {t('fields.requestsLabel')}{' '}
            <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
              {t('fields.requestsOptional')}
            </span>
          </label>
          <textarea
            placeholder={t('fields.requestsPlaceholder')}
            value={form.requests}
            onChange={(e) => setField('requests', e.target.value)}
            rows={3}
            maxLength={500}
            style={{ ...inputStyle(), resize: 'vertical', minHeight: 80 }}
          />
        </div>

        {/* Referral source — temporarily disabled
        {(referrers.length > 0) && (
          <div>
            <label style={labelStyle}>
              {t('fields.referralSourceLabel')}{' '}
              <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                {t('fields.referralSourceOptional')}
              </span>
            </label>
            <select
              value={form.referralSource}
              onChange={(e) => setField('referralSource', e.target.value)}
              style={{ ...inputStyle(), cursor: 'pointer' }}
            >
              <option value="">{t('fields.referralSourcePlaceholder')}</option>
              {referrers.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
              <option value="Google / Online search">{t('fields.referralSourceGoogle')}</option>
              <option value="Social media">{t('fields.referralSourceSocial')}</option>
              <option value="Other">{t('fields.referralSourceOther')}</option>
            </select>
          </div>
        )}
        */}

        {/* Payment notice */}
        <div
          style={{
            background: '#0a1220',
            borderRadius: 6,
            padding: '1rem 1.25rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
          }}
        >
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>💳</span>
          <p style={{ fontSize: '0.82rem', color: '#7a90a8', lineHeight: 1.6 }}>
            <strong style={{ color: '#dce8f5' }}>{t('fields.paymentTitle')}</strong>{' '}
            {t('fields.paymentBody')}
          </p>
        </div>

        {/* Terms */}
        <div>
          <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.agreed}
              onChange={(e) => {
                setField('agreed', e.target.checked);
                touchField('agreed');
              }}
              style={{
                marginTop: 3,
                width: 18,
                height: 18,
                accentColor: '#00b8d9',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: '0.82rem', color: '#7a90a8', lineHeight: 1.6 }}>
              {t('fields.termsText')}{' '}
              <Link href="/terms-conditions" style={{ color: '#00b8d9' }}>
                {t('fields.termsLink')}
              </Link>{' '}
              {t('fields.termsAnd')}{' '}
              <Link href="/privacy-policy" style={{ color: '#00b8d9' }}>
                {t('fields.privacyLink')}
              </Link>
              {' '}*
            </span>
          </label>
          {fieldError('agreed') && <p style={errStyle}>{fieldError('agreed')}</p>}
        </div>

        {/* Total estimate */}
        {selectedTour && (
          <div
            style={{
              background: '#0a1220',
              borderRadius: 6,
              padding: '0.75rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: '#7a90a8' }}>{t('fields.estimateLabel')}</span>
              <div
                style={{
                  fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  color: '#00b8d9',
                }}
              >
                {selectedTour.type === 'group'
                  ? `€${parseInt(selectedTour.price.replace(/[^0-9]/g, '')) * form.guests}`
                  : selectedTour.price}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={submit}
          disabled={!isFormValid || loading}
          style={{
            width: '100%',
            background: loading ? '#0090aa' : '#00b8d9',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            padding: '16px',
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: !isFormValid || loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, opacity 0.2s',
            opacity: !isFormValid && !loading ? 0.45 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            minHeight: 52,
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: 18,
                  height: 18,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }}
              />
              {t('fields.submitting')}
            </>
          ) : (
            t('fields.submit')
          )}
        </button>
      </div>
    </div>
  );
}
