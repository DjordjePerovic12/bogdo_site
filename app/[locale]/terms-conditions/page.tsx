import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import ContactFooter from '@/components/ContactFooter';
import CookieConsent from '@/components/CookieConsent';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.terms' });
  return { title: t('title'), description: t('description') };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
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
              Terms & Conditions
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Last updated: April 2026
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,4rem)' }}>
          <div style={{ fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)', fontSize: '0.95rem', color: '#0d1b35', lineHeight: 1.8 }}>
            {TERMS_SECTIONS.map((section, i) => (
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

const TERMS_SECTIONS = [
  {
    title: '1. Introduction',
    body: `These Terms and Conditions govern your use of the Speed Boat Tour Kotor website and the booking and participation in tours operated by Speed Boat Tour Kotor, a company based in Kotor, Montenegro.\n\nBy making a booking through our website or directly with us, you agree to be bound by these Terms and Conditions. Please read them carefully before booking.`,
  },
  {
    title: '2. Booking & Reservations',
    body: `Bookings are made via our online booking form, by WhatsApp, or by email. Submitting a booking request does not constitute a confirmed reservation. Your booking is confirmed only when you receive a written confirmation from us (by email or WhatsApp) including your booking reference number (format: SBTK-YYMMDD-XXXX).\n\nWe reserve the right to decline bookings without providing a reason. We will notify you promptly in such cases.`,
  },
  {
    title: '3. Payment',
    body: `Payment for all tours is collected in person in cash (EUR) on the day of the tour at the meeting point. No advance online payment is required to hold your reservation.\n\nFor private charters, a deposit may be requested for bookings made significantly in advance. This will be communicated to you at the time of booking.`,
  },
  {
    title: '4. Cancellation & Refunds',
    body: `Cancellations made at least 24 hours before the scheduled tour departure are free of charge. You will receive a full refund of any deposit paid.\n\nCancellations made less than 24 hours before the scheduled departure may result in a cancellation fee. Deposits paid for late cancellations are non-refundable.\n\nIf we cancel a tour due to bad weather, unsafe sea conditions, or any other reason beyond our control, you will be offered the choice of rescheduling to an alternative date or a full refund of any payment made. No additional compensation will be provided.\n\nTo cancel or modify a booking, contact us via WhatsApp at +382 68 620 177 or by email at boattourskotor1@gmail.com.`,
  },
  {
    title: '5. Tour Changes',
    body: `We reserve the right to modify tour routes, itineraries, or schedules due to weather conditions, sea conditions, safety considerations, or operational requirements. In such cases, we will endeavour to provide an alternative of equal or greater value.\n\nWe may cancel a tour entirely for safety reasons. In this case, you will receive a full refund of any payment made.`,
  },
  {
    title: '6. Passenger Responsibilities',
    body: `Passengers are required to arrive at the meeting point at the scheduled departure time. We cannot guarantee to wait for late arrivals, and no refund will be given if you miss your tour.\n\nAll passengers must follow the instructions of the skipper at all times. The skipper has the authority to refuse boarding or to request that a passenger leave the vessel if their behaviour poses a risk to safety or comfort of other passengers.\n\nPassengers who are visibly intoxicated may be refused boarding. No refund will be provided in such cases.\n\nPassengers are responsible for the safety of their personal belongings. We accept no liability for loss or damage to personal items.`,
  },
  {
    title: '7. Safety & Health',
    body: `Life jackets are provided to all passengers and must be worn when instructed by the skipper. Children under 12 years of age must wear life jackets at all times on board.\n\nPassengers with medical conditions, including but not limited to heart conditions, pregnancy, back or neck injuries, motion sickness, or any condition that could be affected by boat movement, should consult their doctor before booking and must inform us at the time of booking.\n\nSwimming at designated stops is at the passenger's own risk. Our crew are not qualified lifeguards.\n\nChildren must be accompanied by a parent or responsible adult at all times. Parents and guardians are responsible for the safety of children in their care.`,
  },
  {
    title: '8. Liability',
    body: `Our liability to you is limited to the price of the tour booking in all circumstances.\n\nWe are not liable for delays, changes, or cancellations caused by weather conditions, technical issues, or other factors beyond our reasonable control.\n\nWe are not responsible for personal injury, loss, damage, or expense caused by the passenger's own negligence or failure to follow safety instructions.\n\nSpeed Boat Tour Kotor maintains appropriate maritime insurance as required by Montenegrin law.`,
  },
  {
    title: '9. Intellectual Property',
    body: `All content on the Speed Boat Tour Kotor website, including but not limited to text, photographs, graphics, and logos, is the property of Speed Boat Tour Kotor and is protected by copyright law. No content may be reproduced, distributed, or used without our prior written consent.`,
  },
  {
    title: '10. Governing Law',
    body: `These Terms and Conditions are governed by and construed in accordance with the laws of Montenegro. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Kotor, Montenegro.`,
  },
  {
    title: '11. Contact',
    body: `If you have any questions about these Terms and Conditions, please contact us:\n\nEmail: boattourskotor1@gmail.com\nPhone / WhatsApp: +382 68 620 177\nLocation: Kotor, Montenegro`,
  },
];
