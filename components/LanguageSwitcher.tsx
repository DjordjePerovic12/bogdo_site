'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LANG_LABELS: Record<string, string> = {
  en: 'EN',
  ru: 'РУ',
  me: 'ME',
  de: 'DE',
  es: 'ES',
  fr: 'FR',
};

export default function LanguageSwitcher({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next });
  }

  if (variant === 'mobile') {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {routing.locales.map((l) => (
          <button
            key={l}
            onClick={() => switchLocale(l)}
            style={{
              background: l === locale ? 'var(--color-teal, #00b8d9)' : 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 3,
              padding: '5px 12px',
              color: '#fff',
              fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.08em',
            }}
          >
            {LANG_LABELS[l]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.3rem' }}>
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          style={{
            background: l === locale ? 'var(--color-teal, #00b8d9)' : 'transparent',
            border: 'none',
            borderRadius: 3,
            padding: '3px 7px',
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            cursor: 'pointer',
            color: l === locale ? '#fff' : 'rgba(255,255,255,0.4)',
            transition: 'background 0.15s, color 0.15s',
          }}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
