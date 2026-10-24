import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import ContactFooter from '@/components/ContactFooter';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';
import YachtGallery from '@/components/YachtGallery';
import YachtInquiryForm from '@/components/YachtInquiryForm';
import YachtCard, { CHAMPAGNE, SERIF, SANS, eyebrowStyle } from '@/components/YachtCard';
import { Link } from '@/i18n/navigation';
import { YACHTS, getYachtBySlug } from '@/lib/yachts';

export async function generateStaticParams() {
  const locales = ['en', 'ru', 'me', 'de', 'es', 'fr'];
  return locales.flatMap((locale) => YACHTS.map((y) => ({ locale, slug: y.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const yacht = getYachtBySlug(slug);
  if (!yacht) return {};

  const t = await getTranslations({ locale, namespace: 'seo.yacht' });
  const vars = { name: yacht.name, model: `${yacht.builder} ${yacht.model}`, length: yacht.lengthM, guests: yacht.guests };
  const title = t('title', vars);
  const description = t('description', vars);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kotorbluecave.me';
  const ogImage = `${siteUrl}${yacht.hero}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/yachts/${slug}`,
      siteName: 'Speed Boat Tour Kotor',
      type: 'website',
      images: [{ url: ogImage, alt: yacht.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    alternates: {
      canonical: `${siteUrl}/en/yachts/${slug}`,
      languages: {
        en: `${siteUrl}/en/yachts/${slug}`,
        de: `${siteUrl}/de/yachts/${slug}`,
        fr: `${siteUrl}/fr/yachts/${slug}`,
        es: `${siteUrl}/es/yachts/${slug}`,
        ru: `${siteUrl}/ru/yachts/${slug}`,
        'x-default': `${siteUrl}/en/yachts/${slug}`,
      },
    },
  };
}

const sectionTitle: React.CSSProperties = {
  ...eyebrowStyle,
  display: 'flex',
  alignItems: 'center',
  gap: '0.9rem',
  marginBottom: '1.75rem',
};

function Rule() {
  return <span style={{ width: 28, height: 1, background: CHAMPAGNE, opacity: 0.7, display: 'inline-block' }} />;
}

export default async function YachtPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const yacht = getYachtBySlug(slug);
  if (!yacht) notFound();

  const t = await getTranslations({ locale, namespace: 'yachts' });
  const others = YACHTS.filter((y) => y.slug !== slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kotorbluecave.me';

  const specs = [
    { label: t('length'), value: `${yacht.lengthM} m` },
    { label: t('guests'), value: yacht.crew ? `${yacht.guests} + ${yacht.crew} ${t('crew')}` : String(yacht.guests) },
    yacht.cabins
      ? { label: t('cabins'), value: `${yacht.cabins} · ${yacht.sleeps} ${t('sleeps').toLowerCase()}` }
      : { label: t('sleeps'), value: String(yacht.sleeps) },
    { label: t('year'), value: yacht.refit ? `${yacht.year} · ${t('refit')} ${yacht.refit}` : String(yacht.year) },
    ...(yacht.speedKn ? [{ label: t('speed'), value: `${yacht.speedKn} ${t('knots')}` }] : []),
  ];

  const ideas = [1, 2, 3, 4].map((n) => ({
    title: t(`idea${n}Title` as 'idea1Title'),
    text: t(`idea${n}Text` as 'idea1Text'),
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${yacht.name} — ${yacht.builder} ${yacht.model}`,
        description: yacht.intro,
        image: yacht.gallery.slice(0, 4).map((g) => `${siteUrl}${g.src}`),
        brand: { '@type': 'Brand', name: yacht.builder },
        url: `${siteUrl}/en/yachts/${slug}`,
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Length', value: yacht.lengthM, unitCode: 'MTR' },
          { '@type': 'PropertyValue', name: 'Guests', value: yacht.guests },
          { '@type': 'PropertyValue', name: 'Year', value: yacht.year },
        ],
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/en` },
          { '@type': 'ListItem', position: 2, name: 'Yachts', item: `${siteUrl}/en/#yachts` },
          { '@type': 'ListItem', position: 3, name: yacht.name, item: `${siteUrl}/en/yachts/${slug}` },
        ],
      })}} />
      <Navbar locale={locale} />

      <style>{`
        .yacht-card .yacht-card-img img { transition: transform 1.4s cubic-bezier(.2,.6,.2,1); }
        .yacht-card:hover .yacht-card-img img { transform: scale(1.03); }
        .yacht-card-cta { border-bottom: 1px solid transparent; padding-bottom: 3px; transition: border-color 0.4s; }
        .yacht-card:hover .yacht-card-cta { border-color: ${CHAMPAGNE}; }
        .yd-layout { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: clamp(2.5rem, 6vw, 5rem); align-items: start; }
        .yd-onboard { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem 2.5rem; }
        .yd-ideas { display: grid; grid-template-columns: 1fr 1fr; gap: 1.75rem 2.5rem; }
        .yd-others { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1.5rem, 3vw, 2.5rem); }
        .yd-back:hover { color: #fff !important; }
        .yd-wa:hover { border-color: ${CHAMPAGNE} !important; color: #f2f4f7 !important; }
        @media (max-width: 900px) {
          .yd-layout { grid-template-columns: 1fr; }
          .yd-sidebar { position: static !important; }
          .yd-others { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .yd-onboard, .yd-ideas, .yd-others { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ background: '#050a14' }}>
        {/* Hero: the whole photo, sized to fit the screen, with the title underneath so it never covers the boat */}
        <div style={{ paddingTop: 70 }}>
          <div
            style={{
              position: 'relative',
              width: `min(100%, calc(80vh * ${yacht.heroSize[0]} / ${yacht.heroSize[1]}))`,
              aspectRatio: `${yacht.heroSize[0]} / ${yacht.heroSize[1]}`,
              margin: '0 auto',
              background: '#0a1220',
            }}
          >
            <Image
              src={yacht.hero}
              alt={`${yacht.name}, ${yacht.builder} ${yacht.model}`}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,6vw,4rem) clamp(2rem,4vw,3rem)' }}>
            <Link href="/#yachts" className="yd-back" style={{ ...eyebrowStyle, color: '#7a90a8', display: 'inline-block', marginBottom: '1.5rem', transition: 'color 0.3s' }}>
              ← {t('allYachts')}
            </Link>
            <div style={{ ...eyebrowStyle, marginBottom: '0.9rem' }}>
              {yacht.builder} {yacht.model} · {yacht.year}
            </div>
            <h1
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(3.4rem, 10vw, 7.5rem)',
                lineHeight: 0.95,
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              {yacht.name}
            </h1>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 'clamp(0.95rem,1.6vw,1.1rem)', color: '#9aabbf', maxWidth: 520, lineHeight: 1.6 }}>
              {yacht.tagline}
            </p>
          </div>
        </div>

        {/* Spec strip */}
        <div style={{ borderTop: '1px solid rgba(200,180,138,0.18)', borderBottom: '1px solid rgba(200,180,138,0.18)', overflowX: 'auto' }}>
          <dl
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              padding: '0 clamp(1.5rem,6vw,4rem)',
              display: 'flex',
            }}
          >
            {specs.map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: '1.6rem clamp(1.25rem,3vw,2.5rem)',
                  paddingLeft: i === 0 ? 0 : undefined,
                  borderLeft: i > 0 ? '1px solid rgba(200,180,138,0.14)' : 'none',
                  minWidth: 'max-content',
                }}
              >
                <dt style={{ ...eyebrowStyle, color: '#7a90a8', fontSize: '0.62rem', marginBottom: 6 }}>{s.label}</dt>
                <dd style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 'clamp(1.35rem,2.4vw,1.7rem)', color: '#f2f4f7', fontVariantNumeric: 'lining-nums' }}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Body */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(3.5rem,8vw,6.5rem) clamp(1.5rem,6vw,4rem)' }}>
          <div className="yd-layout">
            <div>
              <p
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: 'clamp(1.4rem, 2.6vw, 1.85rem)',
                  lineHeight: 1.45,
                  color: '#dce8f5',
                  fontVariantNumeric: 'lining-nums',
                  marginBottom: 'clamp(3rem,6vw,4.5rem)',
                }}
              >
                {yacht.intro}
              </p>

              <h2 style={sectionTitle}><Rule />{t('onBoard')}</h2>
              <div className="yd-onboard" style={{ marginBottom: 'clamp(3rem,6vw,4.5rem)' }}>
                {yacht.onBoard.map((item) => (
                  <div key={item.title}>
                    <h3 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: '1.35rem', color: '#f2f4f7', marginBottom: '0.5rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.92rem', color: '#9aabbf', lineHeight: 1.75 }}>{item.text}</p>
                  </div>
                ))}
              </div>

              <h2 style={sectionTitle}><Rule />{t('ideas')}</h2>
              <ol className="yd-ideas" style={{ listStyle: 'none' }}>
                {ideas.map((idea, i) => (
                  <li key={idea.title} style={{ borderTop: '1px solid #1a2840', paddingTop: '1.1rem' }}>
                    <span style={{ ...eyebrowStyle, fontSize: '0.62rem', display: 'block', marginBottom: '0.5rem' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 style={{ fontFamily: SANS, fontWeight: 500, fontSize: '0.95rem', color: '#dce8f5', marginBottom: '0.35rem' }}>{idea.title}</h3>
                    <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.88rem', color: '#9aabbf', lineHeight: 1.65 }}>{idea.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Inquiry sidebar */}
            <aside
              id="inquire"
              className="yd-sidebar"
              style={{
                position: 'sticky',
                top: 96,
                background: '#0a1120',
                border: '1px solid rgba(200,180,138,0.22)',
                borderRadius: 2,
                padding: 'clamp(1.5rem,3vw,2.1rem)',
              }}
            >
              <div style={{ ...eyebrowStyle, marginBottom: '0.6rem' }}>{t('request')}</div>
              <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: '1.6rem', color: '#f2f4f7', lineHeight: 1.15, marginBottom: '0.4rem' }}>
                {yacht.name}
              </p>
              <p style={{ fontSize: '0.78rem', color: '#7a90a8', lineHeight: 1.7, marginBottom: '1.6rem' }}>
                {t('onRequest')}
                <br />
                {t('departs')}
              </p>
              <YachtInquiryForm yachtSlug={yacht.slug} maxGuests={yacht.guests} />
              <a
                href={`https://wa.me/38268620177?text=${encodeURIComponent(`Hi! I'm interested in chartering ${yacht.name} (${yacht.builder} ${yacht.model}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="yd-wa"
                style={{
                  marginTop: '1.1rem',
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  border: '1px solid #24344f',
                  borderRadius: 2,
                  color: '#9aabbf',
                  fontSize: '0.74rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  transition: 'border-color 0.3s, color 0.3s',
                }}
              >
                {t('whatsapp')}
              </a>
            </aside>
          </div>
        </div>

        {/* Gallery */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(1.5rem,6vw,4rem) clamp(4rem,8vw,6.5rem)' }}>
          <h2 style={sectionTitle}><Rule />{t('gallery')}</h2>
          <YachtGallery images={yacht.gallery} />
        </div>

        {/* Other yachts */}
        <div style={{ borderTop: '1px solid rgba(200,180,138,0.18)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(4rem,8vw,6.5rem) clamp(1.5rem,6vw,4rem)' }}>
            <h2 style={sectionTitle}><Rule />{t('other')}</h2>
            <div className="yd-others">
              {others.map((y) => (
                <YachtCard key={y.slug} yacht={y} />
              ))}
            </div>
            <p style={{ marginTop: '3rem', fontSize: '0.75rem', color: '#5d7088' }}>{t('credit')}</p>
          </div>
        </div>

        <ContactFooter />
      </div>
      <WhatsAppButton />
      <CookieConsent />
    </>
  );
}
