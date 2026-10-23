import { Resend } from 'resend';
import twilio from 'twilio';
import { DURATION_LABELS, type YachtInquiryPayload } from './yachtInquiry';

// Yacht leads go to the same people as tour bookings unless the YACHT_* env vars
// point them elsewhere (e.g. AKUL's own team).
const FROM = process.env.RESEND_FROM || 'Speed Boat Tour Kotor <noreply@speedboattourkotor.com>';

function list(value: string | undefined): string[] {
  return (value || '').split(',').map((v) => v.trim()).filter(Boolean);
}

function ownerEmails(): string[] {
  const custom = list(process.env.YACHT_NOTIFICATION_EMAIL);
  if (custom.length) return custom;
  return [process.env.NOTIFICATION_EMAIL, process.env.NOTIFICATION_EMAIL_BOAT_TOURS, process.env.NOTIFICATION_EMAIL_TEST]
    .filter((v): v is string => !!v);
}

function ownerPhones(): string[] {
  const custom = list(process.env.YACHT_SMS_RECIPIENTS);
  if (custom.length) return custom;
  return [
    process.env.OWNER_PHONE_BOGDAN || '+38268620177',
    process.env.OWNER_PHONE_DIMITRIJ || '+38268160664',
    process.env.OWNER_PHONE_TEST || '',
  ].filter(Boolean);
}

function esc(s: string | number): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export interface YachtInquiryData extends YachtInquiryPayload {
  ref: string;
  yachtName: string;
}

function rows(d: YachtInquiryData): string {
  return [
    ['Yacht', d.yachtName],
    ['Date', d.date],
    ['Duration', DURATION_LABELS[d.duration]],
    ['Guests', d.guests],
    ['Name', d.name],
    ['Email', d.email],
    ['Phone', d.phone],
    ...(d.notes ? [['Notes', d.notes]] : []),
  ]
    .map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`)
    .join('');
}

const baseStyle = `
  body { font-family: Georgia, 'Times New Roman', serif; color: #1b2233; background: #f6f4ef; margin: 0; }
  .c { max-width: 560px; margin: 0 auto; padding: 32px 24px; }
  .h { background: #070c18; padding: 36px 28px; text-align: left; }
  .h small { color: #c8b48a; font: 11px Arial, sans-serif; letter-spacing: 0.2em; text-transform: uppercase; }
  .h h1 { color: #fff; font-weight: normal; font-style: italic; font-size: 28px; margin: 10px 0 0; }
  .b { background: #fff; padding: 28px; border: 1px solid #e6e2d8; border-top: none; font: 14px/1.6 Arial, sans-serif; }
  table { width: 100%; border-collapse: collapse; margin: 18px 0; }
  td { padding: 9px 0; border-bottom: 1px solid #eee9de; font-size: 14px; vertical-align: top; }
  td:first-child { color: #7a7466; width: 34%; }
  .ref { font: 600 13px Arial, sans-serif; letter-spacing: 0.12em; color: #8a7444; }
`;

export async function sendYachtInquiryOwner(d: YachtInquiryData) {
  const to = ownerEmails();
  if (!to.length || !process.env.RESEND_API_KEY) throw new Error('Owner email not configured');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyle}</style></head><body><div class="c">
  <div class="h"><small>Yacht inquiry</small><h1>${esc(d.yachtName)}</h1></div>
  <div class="b">
    <p class="ref">${esc(d.ref)}</p>
    <table>${rows(d)}</table>
    <p><a href="mailto:${esc(d.email)}">Reply by email</a> · <a href="https://wa.me/${esc(d.phone.replace(/\D/g, ''))}">WhatsApp</a></p>
  </div></div></body></html>`;
  const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: FROM,
    to,
    replyTo: d.email,
    subject: `Yacht inquiry — ${d.yachtName} — ${d.date}`,
    html,
  });
  if (result.error) throw new Error(`Resend yacht owner email: ${result.error.message}`);
}

export async function sendYachtInquiryCustomer(d: YachtInquiryData) {
  if (!process.env.RESEND_API_KEY) throw new Error('Resend not configured');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyle}</style></head><body><div class="c">
  <div class="h"><small>Private yachts · Boka Bay</small><h1>Thank you, ${esc(d.name.split(' ')[0])}.</h1></div>
  <div class="b">
    <p>We have received your request for <strong>${esc(d.yachtName)}</strong> and will reply within a few hours with availability and a quote.</p>
    <p class="ref">Reference ${esc(d.ref)}</p>
    <table>${rows(d)}</table>
    <p>If anything changes, simply reply to this email or message us on <a href="https://wa.me/38268620177">WhatsApp</a>.</p>
  </div></div></body></html>`;
  const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: FROM,
    to: d.email,
    subject: `Your request for ${d.yachtName} — ${d.ref}`,
    html,
  });
  if (result.error) throw new Error(`Resend yacht customer email: ${result.error.message}`);
}

function twilioClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export async function sendYachtInquiryMessages(d: YachtInquiryData) {
  const client = twilioClient();
  if (!client) throw new Error('Twilio not configured');
  const from = process.env.TWILIO_PHONE_NUMBER!;
  const summary =
    `${d.yachtName}, ${d.date} (${DURATION_LABELS[d.duration]}), ${d.guests} guest(s), ` +
    `${d.name}, ${d.phone}. Ref: ${d.ref}`;

  const sends = ownerPhones().flatMap((to) => [
    client.messages.create({ from, to, body: `New yacht inquiry: ${summary}` }),
    ...(process.env.WHATSAPP_ENABLED === 'true'
      ? [client.messages.create({ from: `whatsapp:${from}`, to: `whatsapp:${to}`, body: `⚓ *New yacht inquiry*\n${summary}` })]
      : []),
  ]);
  const results = await Promise.allSettled(sends);
  const failed = results.filter((r) => r.status === 'rejected');
  if (failed.length) throw new Error(`${failed.length} of ${results.length} messages failed`);
}
