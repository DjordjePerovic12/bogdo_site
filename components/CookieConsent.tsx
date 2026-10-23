'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function CookieConsent() {
  const t = useTranslations('cookie');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = document.cookie.split(';').find((c) => c.trim().startsWith('cookie_consent='));
    if (!consent) setVisible(true);
  }, []);

  function setConsent(value: 'accepted' | 'essential') {
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `cookie_consent=${value}; expires=${expires}; path=/; SameSite=Lax`;
    setVisible(false);
    if (value === 'accepted') {
      window.dispatchEvent(new Event('cookie_consent_accepted'));
    }
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 800,
        background: '#030710',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '1rem clamp(1rem, 4vw, 2rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          fontSize: '0.82rem',
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.5,
        }}
      >
        {t('message')}{' '}
        <Link href="/privacy-policy" style={{ color: '#00b8d9', textDecoration: 'underline' }}>
          {t('policyLink')}
        </Link>
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <button
          onClick={() => setConsent('essential')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.7)',
            borderRadius: 4,
            padding: '7px 14px',
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            fontSize: '0.78rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {t('essentialOnly')}
        </button>
        <button
          onClick={() => setConsent('accepted')}
          style={{
            background: '#00b8d9',
            border: 'none',
            color: '#fff',
            borderRadius: 4,
            padding: '7px 14px',
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {t('acceptAll')}
        </button>
      </div>
    </div>
  );
}
