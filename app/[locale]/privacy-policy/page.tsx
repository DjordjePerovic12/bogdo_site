import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import ContactFooter from '@/components/ContactFooter';
import CookieConsent from '@/components/CookieConsent';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.privacy' });
  return { title: t('title'), description: t('description') };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <Navbar locale={locale} />
      <div style={{ paddingTop: 70 }}>
        <div style={{ background: '#080f1e', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,4rem)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <Link href="/">
              <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 4, padding: '6px 14px', fontSize: '0.75rem', marginBottom: '1.5rem', cursor: 'pointer' }}>← Home</span>
            </Link>
            <h1 style={{ fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontStyle: 'italic', fontWeight: 600, color: '#fff' }}>
              Privacy Policy
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Last updated: April 2026
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,4rem)' }}>
          <div style={{ fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)', fontSize: '0.95rem', color: '#0d1b35', lineHeight: 1.8 }}>
            {PRIVACY_SECTIONS.map((section, i) => (
              <div key={i} style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)', fontSize: '1.5rem', fontWeight: 600, fontStyle: 'italic', color: '#0d1b35', marginBottom: '0.75rem' }}>
                  {section.title}
                </h2>
                <div style={{ color: '#5a6a7e', lineHeight: 1.8 }}>
                  {section.body.split('\n').map((para, j) => (
                    <p key={j} style={{ marginBottom: '0.75rem' }}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ContactFooter />
      </div>
      <CookieConsent />
    </>
  );
}

const PRIVACY_SECTIONS = [
  {
    title: '1. Introduction',
    body: `Speed Boat Tour Kotor ("we", "us", "our") is committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website (speedboattourkotor.com) or book a tour with us.\n\nWe are the data controller for your personal data. Contact us at: boattourskotor1@gmail.com.`,
  },
  {
    title: '2. What Data We Collect',
    body: `When you make a booking through our website, we collect the following information:\n\n• Full name\n• Email address\n• Phone number (WhatsApp)\n• Tour preference, date, time, and number of guests\n• Special requests\n\nWhen you visit our website, we may also collect:\n• Pages visited and browsing behaviour (via analytics, only with your consent)\n• Browser type and device type\n• IP address (via web server logs)\n• Cookie consent preferences`,
  },
  {
    title: '3. Why We Collect It (Legal Basis)',
    body: `We collect and process your personal data on the following legal bases under GDPR:\n\n• Contract performance: To process your booking, confirm your reservation, and provide you with tour details (meeting point, schedule changes).\n• Legitimate interests: To contact you about your booking, respond to inquiries, and improve our services.\n• Consent: To load analytics cookies (Google Analytics). Analytics are only activated after you have given explicit consent via our cookie banner.\n\nYou are not required to provide your personal data, but without it we cannot process your booking.`,
  },
  {
    title: '4. How We Use Your Data',
    body: `We use your personal data to:\n\n• Process and confirm your tour booking\n• Send you your booking confirmation email\n• Contact you via WhatsApp and email with the exact meeting point and any tour-related information\n• Notify you of changes to your booking (weather cancellations, schedule changes)\n• Improve our website and services (using aggregated, anonymised analytics data)\n• Comply with our legal obligations`,
  },
  {
    title: '5. Third-Party Services (Data Processors)',
    body: `We share your data only with trusted service providers who process data on our behalf:\n\n• Resend (resend.com) — processes your email address to send booking confirmations\n• Twilio (twilio.com) — processes your phone number to send SMS and WhatsApp notifications to our team\n• Vercel — hosts our website and processes standard web server logs\n• Google Analytics — processes anonymised website usage data (only if you have given consent)\n\nAll third-party processors are GDPR-compliant and have appropriate data processing agreements in place. We do not sell, rent, or share your personal data with third parties for marketing purposes.`,
  },
  {
    title: '6. Data Retention',
    body: `We retain your personal data for the following periods:\n\n• Booking data: Retained for the duration of the booking season plus 1 year for business record-keeping purposes, then securely deleted.\n• Email correspondence: Retained for 1 year, then deleted.\n• Analytics data: Anonymised; retained per Google Analytics default settings (26 months).\n\nWhen data is no longer needed, it is securely deleted or anonymised.`,
  },
  {
    title: '7. Your Rights (GDPR Articles 15–22)',
    body: `Under the General Data Protection Regulation (GDPR), you have the following rights:\n\n• Right to access: Request a copy of the personal data we hold about you.\n• Right to rectification: Request correction of inaccurate personal data.\n• Right to erasure ("right to be forgotten"): Request deletion of your personal data.\n• Right to restrict processing: Request that we limit how we use your data.\n• Right to data portability: Request your data in a structured, machine-readable format.\n• Right to object: Object to our processing of your personal data for legitimate interests.\n• Right to withdraw consent: Withdraw consent for analytics cookies at any time via our cookie settings.\n\nTo exercise any of these rights, contact us at boattourskotor1@gmail.com. We will respond within 30 days. You also have the right to lodge a complaint with your national data protection supervisory authority.`,
  },
  {
    title: '8. Cookies',
    body: `We use the following cookies:\n\n• Essential cookies: Language preference (locale) and cookie consent choice. These are strictly necessary for the website to function. No consent required.\n• Analytics cookies (Google Analytics): Used to understand how visitors use our website. These are loaded only after you have given explicit consent via our cookie banner. You can withdraw consent at any time by clearing your cookies.\n\nWe do not use advertising, tracking, or third-party marketing cookies.`,
  },
  {
    title: '9. International Data Transfers',
    body: `Some of our service providers (Resend, Twilio, Vercel, Google) may process your data on servers located outside the European Economic Area (EEA). These transfers are protected by appropriate safeguards, including Standard Contractual Clauses (SCCs) approved by the European Commission.`,
  },
  {
    title: '10. Children\'s Privacy',
    body: `Our website and tours are intended for adults. We do not knowingly collect personal data from children under the age of 16. Bookings must be made by a parent or guardian on behalf of minors. If you believe we have inadvertently collected data from a child, please contact us and we will delete it promptly.`,
  },
  {
    title: '11. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The "last updated" date at the top of this page will be revised accordingly. We encourage you to review this policy periodically.`,
  },
  {
    title: '12. Contact',
    body: `For any questions, requests, or concerns regarding this Privacy Policy or your personal data:\n\nEmail: boattourskotor1@gmail.com\nPhone / WhatsApp: +382 68 620 177\nAddress: Kotor, Montenegro`,
  },
];
