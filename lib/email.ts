import { Resend } from 'resend';
import type { BookingPayload } from './booking';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder');
}
const FROM = process.env.RESEND_FROM || 'Speed Boat Tour Kotor <noreply@speedboattourkotor.com>';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || '';
const NOTIFICATION_EMAIL_TEST = process.env.NOTIFICATION_EMAIL_TEST || '';
const NOTIFICATION_EMAIL_BOAT_TOURS = process.env.NOTIFICATION_EMAIL_BOAT_TOURS || '';

interface EmailData extends BookingPayload {
  bookingRef: string;
  tourName: string;
}

export async function sendCustomerConfirmation(data: EmailData) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #0d1b35; background: #f8f7f4; margin: 0; padding: 0; }
  .container { max-width: 560px; margin: 0 auto; padding: 32px 24px; }
  .header { background: #080f1e; padding: 32px 24px; border-radius: 8px 8px 0 0; text-align: center; }
  .header h1 { color: #fff; font-size: 24px; margin: 0 0 4px; font-style: italic; }
  .header p { color: rgba(255,255,255,0.6); font-size: 13px; margin: 0; }
  .body { background: #fff; padding: 32px 24px; border-radius: 0 0 8px 8px; border: 1px solid #e4e6ea; border-top: none; }
  .ref { background: #f2f0ed; border-radius: 6px; padding: 16px; text-align: center; margin: 24px 0; }
  .ref span { font-size: 22px; font-weight: 700; color: #0098b4; letter-spacing: 0.08em; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  td { padding: 10px 0; border-bottom: 1px solid #e4e6ea; font-size: 14px; }
  td:first-child { color: #5a6a7e; width: 40%; }
  td:last-child { font-weight: 600; }
  .notice { background: #f2f0ed; border-radius: 6px; padding: 14px 16px; font-size: 13px; color: #5a6a7e; margin: 20px 0; line-height: 1.6; }
  .footer { text-align: center; padding: 24px; font-size: 12px; color: #5a6a7e; }
  a { color: #0098b4; }
</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>Booking Confirmed!</h1>
    <p>Speed Boat Tour Kotor · Boka Bay · Montenegro</p>
  </div>
  <div class="body">
    <p>Hi ${data.name.split(' ')[0]},</p>
    <p>Thank you for booking with <strong>Speed Boat Tour Kotor</strong>! Your booking request has been received.</p>
    <div class="ref">
      <div style="font-size:12px;color:#5a6a7e;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em">Your Reference Number</div>
      <span>${data.bookingRef}</span>
    </div>
    <table>
      <tr><td>Tour</td><td>${data.tourName}</td></tr>
      <tr><td>Date</td><td>${data.date}</td></tr>
      <tr><td>Time</td><td>${data.time}</td></tr>
      <tr><td>Guests</td><td>${data.guests}</td></tr>
      <tr><td>Name</td><td>${data.name}</td></tr>
      <tr><td>Email</td><td>${data.email}</td></tr>
      <tr><td>Phone</td><td>${data.phone}</td></tr>
      ${data.requests ? `<tr><td>Requests</td><td>${data.requests}</td></tr>` : ''}
    </table>
    <div class="notice">
      <strong>What happens next:</strong><br>
      Our team will contact you via <strong>WhatsApp</strong> with the exact meeting point and any final details before your tour.
    </div>
    <div class="notice">
      💳 <strong>Payment:</strong> Collected in cash on the day of the tour at the marina. No advance payment required.
    </div>
    <p>Questions? Reach us at <a href="mailto:boattourskotor1@gmail.com">boattourskotor1@gmail.com</a> or <a href="https://wa.me/38268620177">WhatsApp</a>.</p>
    <p>See you on the water!<br><strong>Speed Boat Tour Kotor</strong></p>
  </div>
  <div class="footer">© 2026 Speed Boat Tour Kotor · Kotor, Montenegro</div>
</div>
</body></html>`;

  const result = await getResend().emails.send({
    from: FROM,
    to: data.email,
    subject: `Booking Confirmation — ${data.tourName} — ${data.date}`,
    html,
  });
  if (result.error) throw new Error(`Resend customer email: ${result.error.message}`);
  return result;
}

export async function sendOwnerNotification(data: EmailData) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #0d1b35; background: #f8f7f4; }
  .container { max-width: 560px; margin: 0 auto; padding: 24px; }
  h2 { color: #0098b4; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 10px 0; border-bottom: 1px solid #e4e6ea; font-size: 14px; }
  td:first-child { color: #5a6a7e; width: 35%; font-weight: 600; }
  .ref { font-size: 20px; font-weight: 700; color: #0098b4; }
</style></head>
<body>
<div class="container">
  <h2>🚤 New Booking — ${data.tourName}</h2>
  <table>
    <tr><td>Reference</td><td class="ref">${data.bookingRef}</td></tr>
    <tr><td>Tour</td><td>${data.tourName}</td></tr>
    <tr><td>Date</td><td>${data.date}</td></tr>
    <tr><td>Time</td><td>${data.time}</td></tr>
    <tr><td>Guests</td><td>${data.guests}</td></tr>
    <tr><td>First Name</td><td>${data.name}</td></tr>
    <tr><td>Last Name</td><td>${(data as any).lastName || '—'}</td></tr>
    <tr><td>Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
    <tr><td>Phone</td><td><a href="tel:${data.phone}">${data.phone}</a> · <a href="https://wa.me/${data.phone.replace(/\D/g, '')}">WhatsApp</a></td></tr>
    ${data.requests ? `<tr><td>Requests</td><td>${data.requests}</td></tr>` : ''}
    <tr><td>Submitted</td><td>${new Date().toISOString()}</td></tr>
  </table>
</div>
</body></html>`;

  const to = [NOTIFICATION_EMAIL, NOTIFICATION_EMAIL_BOAT_TOURS, NOTIFICATION_EMAIL_TEST].filter(Boolean);
  const result = await getResend().emails.send({
    from: FROM,
    to,
    subject: `🚤 New Booking — ${data.tourName} — ${data.date}`,
    html,
  });
  if (result.error) throw new Error(`Resend owner email: ${result.error.message}`);
}
