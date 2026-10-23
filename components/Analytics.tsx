'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function Analytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    function onConsent() {
      if (GA_ID && typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        script.async = true;
        document.head.appendChild(script);
        script.onload = () => {
          (window as any).dataLayer = (window as any).dataLayer || [];
          function gtag(...args: unknown[]) { (window as any).dataLayer.push(args); }
          gtag('js', new Date());
          gtag('config', GA_ID);
        };
      }
    }

    const consent = document.cookie.split(';').find((c) => c.trim().startsWith('cookie_consent=accepted'));
    if (consent) onConsent();

    window.addEventListener('cookie_consent_accepted', onConsent);
    return () => window.removeEventListener('cookie_consent_accepted', onConsent);
  }, [GA_ID]);

  return null;
}
