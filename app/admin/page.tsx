'use client';

import { useState, useEffect, useCallback } from 'react';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
  approved: boolean;
}

interface ReferralEntry {
  id: string;
  bookingRef: string;
  tourSlug: string;
  tourName: string;
  tourType: 'group' | 'private';
  guests: number;
  totalPrice: number;
  referralSource: string;
  tourDate: string;
  createdAt: string;
}

const s = {
  body: { minHeight: '100vh', width: '100%', background: '#070c18', padding: '2rem', fontFamily: 'DM Sans, sans-serif', margin: 0, boxSizing: 'border-box' as const } as React.CSSProperties,
  card: { background: '#0f1930', border: '1px solid #1a2840', borderRadius: 8, padding: '1.25rem', marginBottom: '1rem' } as React.CSSProperties,
  input: { width: '100%', padding: '12px 14px', borderRadius: 6, border: '1.5px solid #1a2840', background: '#0d1525', color: '#dce8f5', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties,
  btn: (color: string): React.CSSProperties => ({ background: color, color: '#fff', border: 'none', borderRadius: 5, padding: '8px 18px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', letterSpacing: '0.05em' }),
};

type MainTab = 'reviews' | 'referrals' | 'partners';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [mainTab, setMainTab] = useState<MainTab>('reviews');

  // Reviews state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [reviewFilter, setReviewFilter] = useState<'pending' | 'approved' | 'all'>('pending');

  // Referrals state
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [referralFilter, setReferralFilter] = useState<string>('all');

  // Partners state
  const [referrers, setReferrers] = useState<string[]>([]);
  const [newPartner, setNewPartner] = useState('');
  const [partnerError, setPartnerError] = useState('');

  const loadTestimonials = useCallback(async () => {
    const res = await fetch('/api/admin/testimonials');
    if (res.status === 401) { setAuthed(false); return; }
    const data = await res.json();
    setTestimonials(data.testimonials || []);
  }, []);

  const loadReferrals = useCallback(async () => {
    const res = await fetch('/api/admin/referrals');
    if (res.ok) {
      const data = await res.json();
      setReferrals(data.referrals || []);
    }
  }, []);

  const loadReferrers = useCallback(async () => {
    const res = await fetch('/api/admin/referrers');
    if (res.ok) {
      const data = await res.json();
      setReferrers(data.referrers || []);
    }
  }, []);

  useEffect(() => {
    fetch('/api/admin/testimonials').then((r) => {
      if (r.ok) {
        setAuthed(true);
        loadTestimonials();
        loadReferrals();
        loadReferrers();
      }
    });
  }, [loadTestimonials, loadReferrals, loadReferrers]);

  async function login() {
    setLoginError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      loadTestimonials();
      loadReferrals();
      loadReferrers();
    } else {
      setLoginError('Wrong password');
    }
  }

  async function reviewAction(id: string, act: 'approve' | 'delete') {
    if (act === 'delete' && !confirm('Delete this review? This cannot be undone.')) return;
    await fetch('/api/admin/testimonials', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: act }),
    });
    loadTestimonials();
  }

  async function addPartner() {
    const name = newPartner.trim();
    if (!name) return;
    if (referrers.includes(name)) {
      setPartnerError('Already in list');
      return;
    }
    setPartnerError('');
    const res = await fetch('/api/admin/referrers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const data = await res.json();
      setReferrers(data.referrers || []);
      setNewPartner('');
    }
  }

  async function deletePartner(name: string) {
    if (!confirm(`Remove "${name}" from the list?`)) return;
    const res = await fetch('/api/admin/referrers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const data = await res.json();
      setReferrers(data.referrers || []);
    }
  }

  const reset = <style>{`html,body{margin:0;padding:0;background:#070c18;}`}</style>;

  if (!authed) {
    return (
      <div style={{ ...s.body, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {reset}
        <div style={{ width: 360 }}>
          <h1 style={{ color: '#dce8f5', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', marginBottom: '0.5rem' }}>Admin</h1>
          <p style={{ color: '#7a90a8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Speed Boat Tour Kotor</p>
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              style={{ ...s.input, paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#7a90a8', fontSize: '1rem', padding: 0, lineHeight: 1,
              }}
            >
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>
          {loginError && <p style={{ color: '#e05555', fontSize: '0.82rem', marginBottom: '0.5rem' }}>{loginError}</p>}
          <button onClick={login} style={{ ...s.btn('#00b8d9'), width: '100%', padding: '12px' }}>Sign In</button>
        </div>
      </div>
    );
  }

  const pending = testimonials.filter((t) => !t.approved).length;
  const filteredReviews = testimonials.filter((t) =>
    reviewFilter === 'all' ? true : reviewFilter === 'pending' ? !t.approved : t.approved
  );

  // Referrals summary grouped by source
  const uniqueSources = Array.from(new Set(referrals.map((r) => r.referralSource)));
  const summary = uniqueSources.map((src) => {
    const entries = referrals.filter((r) => r.referralSource === src);
    return {
      source: src,
      bookings: entries.length,
      guests: entries.reduce((s, r) => s + r.guests, 0),
      revenue: entries.reduce((s, r) => s + r.totalPrice, 0),
    };
  }).sort((a, b) => b.bookings - a.bookings);

  const filteredReferrals = referralFilter === 'all'
    ? referrals
    : referrals.filter((r) => r.referralSource === referralFilter);

  return (
    <div style={s.body}>
      {reset}
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 style={{ color: '#dce8f5', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.8rem', margin: 0 }}>Admin</h1>
            <p style={{ color: '#7a90a8', fontSize: '0.82rem', margin: '4px 0 0' }}>Speed Boat Tour Kotor</p>
          </div>
          {pending > 0 && (
            <span style={{ background: '#e0a020', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
              {pending} pending
            </span>
          )}
        </div>

        {/* Main tab switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
          {(['reviews', 'referrals', 'partners'] as MainTab[]).map((tab) => (
            <button key={tab} onClick={() => setMainTab(tab)} style={{
              ...s.btn(mainTab === tab ? '#00b8d9' : 'transparent'),
              border: `1px solid ${mainTab === tab ? '#00b8d9' : '#1a2840'}`,
              textTransform: 'capitalize',
            }}>{tab}</button>
          ))}
        </div>

        {/* ── REVIEWS TAB ─────────────────────────────────────────────────── */}
        {mainTab === 'reviews' && (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {(['pending', 'approved', 'all'] as const).map((f) => (
                <button key={f} onClick={() => setReviewFilter(f)} style={{
                  ...s.btn(reviewFilter === f ? '#00b8d9' : 'transparent'),
                  border: `1px solid ${reviewFilter === f ? '#00b8d9' : '#1a2840'}`,
                  textTransform: 'capitalize',
                }}>{f}</button>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <p style={{ color: '#7a90a8', textAlign: 'center', padding: '3rem 0' }}>No reviews here yet.</p>
            )}

            {filteredReviews.map((t) => (
              <div key={t.id} style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ color: '#dce8f5', fontWeight: 600, marginRight: 8 }}>{t.name}</span>
                    <span style={{ color: '#e0a020', fontSize: '1rem' }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: '#4a607a', fontSize: '0.72rem' }}>{new Date(t.date).toLocaleDateString()}</span>
                    {!t.approved && (
                      <span style={{ background: '#0a1220', color: '#e0a020', fontSize: '0.68rem', padding: '2px 8px', borderRadius: 3, fontWeight: 600 }}>PENDING</span>
                    )}
                  </div>
                </div>
                <p style={{ color: '#7a90a8', fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 1rem' }}>{t.text}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!t.approved && (
                    <button onClick={() => reviewAction(t.id, 'approve')} style={s.btn('#22c55e')}>✓ Approve</button>
                  )}
                  <button onClick={() => reviewAction(t.id, 'delete')} style={s.btn('#e05555')}>✕ Delete</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── REFERRALS TAB ────────────────────────────────────────────────── */}
        {mainTab === 'referrals' && (
          <>
            {referrals.length === 0 && (
              <p style={{ color: '#7a90a8', textAlign: 'center', padding: '3rem 0' }}>No referred bookings yet.</p>
            )}

            {summary.length > 0 && (
              <>
                <p style={{ color: '#7a90a8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Summary by source</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                  {summary.map((s) => (
                    <div key={s.source} style={{ background: '#0f1930', border: '1px solid #1a2840', borderRadius: 8, padding: '1rem' }}>
                      <div style={{ color: '#00b8d9', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', wordBreak: 'break-word' }}>{s.source}</div>
                      <div style={{ fontSize: '0.8rem', color: '#7a90a8' }}>{s.bookings} booking{s.bookings !== 1 ? 's' : ''}</div>
                      <div style={{ fontSize: '0.8rem', color: '#7a90a8' }}>{s.guests} guest{s.guests !== 1 ? 's' : ''}</div>
                      <div style={{ fontSize: '1rem', color: '#22c55e', fontWeight: 700, marginTop: '0.4rem' }}>€{s.revenue}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {referrals.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <p style={{ color: '#7a90a8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>All bookings</p>
                  <select
                    value={referralFilter}
                    onChange={(e) => setReferralFilter(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 5, border: '1px solid #1a2840', background: '#0d1525', color: '#dce8f5', fontSize: '0.8rem', outline: 'none' }}
                  >
                    <option value="all">All sources</option>
                    {uniqueSources.map((src) => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #1a2840' }}>
                        {['Booking Ref', 'Tour', 'Date', 'Guests', 'Revenue', 'Source'].map((h) => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#4a607a', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReferrals.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #0f1930' }}>
                          <td style={{ padding: '10px 12px', color: '#00b8d9', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{r.bookingRef}</td>
                          <td style={{ padding: '10px 12px', color: '#dce8f5', whiteSpace: 'nowrap' }}>{r.tourName}</td>
                          <td style={{ padding: '10px 12px', color: '#7a90a8', whiteSpace: 'nowrap' }}>{r.tourDate}</td>
                          <td style={{ padding: '10px 12px', color: '#dce8f5', textAlign: 'center' }}>{r.guests}</td>
                          <td style={{ padding: '10px 12px', color: '#22c55e', fontWeight: 600 }}>€{r.totalPrice}</td>
                          <td style={{ padding: '10px 12px', color: '#dce8f5' }}>{r.referralSource}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

        {/* ── PARTNERS TAB ─────────────────────────────────────────────────── */}
        {mainTab === 'partners' && (
          <>
            <p style={{ color: '#7a90a8', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Partners listed here appear in the booking form dropdown. Add hotels, guides, or anyone who refers customers to you.
            </p>

            {/* Add partner */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Partner name (e.g. Hotel Cattaro)"
                value={newPartner}
                onChange={(e) => { setNewPartner(e.target.value); setPartnerError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && addPartner()}
                style={{ ...s.input, flex: 1, minWidth: 200 }}
              />
              <button onClick={addPartner} style={{ ...s.btn('#00b8d9'), padding: '12px 20px' }}>+ Add</button>
            </div>
            {partnerError && <p style={{ color: '#e05555', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{partnerError}</p>}

            {referrers.length === 0 && (
              <p style={{ color: '#7a90a8', textAlign: 'center', padding: '2rem 0' }}>No partners added yet.</p>
            )}

            {referrers.map((name) => (
              <div key={name} style={{ ...s.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: '#dce8f5', fontWeight: 500 }}>{name}</span>
                <button onClick={() => deletePartner(name)} style={s.btn('#e05555')}>✕ Remove</button>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
