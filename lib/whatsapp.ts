import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM = `whatsapp:${process.env.TWILIO_PHONE_NUMBER || ''}`;
const BOGDAN = `whatsapp:${process.env.OWNER_PHONE_BOGDAN || '+38268620177'}`;
const DIMITRIJ = `whatsapp:${process.env.OWNER_PHONE_DIMITRIJ || '+38268160664'}`;
const TEST = process.env.OWNER_PHONE_TEST ? `whatsapp:${process.env.OWNER_PHONE_TEST}` : '';

export async function sendOwnerWhatsApp(params: {
  tourName: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  bookingRef: string;
}) {
  if (process.env.WHATSAPP_ENABLED !== 'true') return;

  const body =
    `🚤 *New Booking!*\n` +
    `Tour: ${params.tourName}\n` +
    `Date: ${params.date}\n` +
    `Time: ${params.time}\n` +
    `Guests: ${params.guests}\n` +
    `Name: ${params.name}\n` +
    `Phone: ${params.phone}\n` +
    `Ref: ${params.bookingRef}`;

  const recipients = [BOGDAN, DIMITRIJ, TEST].filter(Boolean);
  const results = await Promise.allSettled(
    recipients.map((to) => client.messages.create({ from: FROM, to, body }))
  );
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`[whatsapp] ${recipients[i]} failed:`, r.reason?.message);
    else console.log(`[whatsapp] ${recipients[i]} sent, sid: ${r.value.sid}`);
  });
}
