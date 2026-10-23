import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM = process.env.TWILIO_PHONE_NUMBER || '';
const BOGDAN = process.env.OWNER_PHONE_BOGDAN || '+38268620177';
const DIMITRIJ = process.env.OWNER_PHONE_DIMITRIJ || '+38268160664';
const TEST = process.env.OWNER_PHONE_TEST || '';

export async function sendOwnerSMS(params: {
  tourName: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  bookingRef: string;
  referralSource?: string;
}) {
  const refPart = params.referralSource ? ` Via: ${params.referralSource}.` : '';
  const body =
    `New booking: ${params.tourName}, ${params.date} ${params.time}, ` +
    `${params.guests} guest(s), ${params.name}, ${params.phone}. Ref: ${params.bookingRef}${refPart}`;

  const recipients = [BOGDAN, DIMITRIJ, TEST].filter(Boolean);
  await Promise.allSettled(
    recipients.map((to) => client.messages.create({ from: FROM, to, body }))
  );
}
