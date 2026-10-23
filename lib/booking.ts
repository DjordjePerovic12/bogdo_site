import { z } from 'zod';

export const bookingSchema = z.object({
  tourSlug: z.string().min(1, 'Tour is required'),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine((d) => new Date(d) >= new Date(new Date().toDateString()), 'Date cannot be in the past'),
  time: z.string().min(1, 'Time is required'),
  guests: z.number().int().min(1).max(12),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.string().email('Valid email required').max(254),
  phone: z.string().trim().min(5, 'Phone number required').max(30),
  requests: z.string().max(500).optional(),
  referralSource: z.string().trim().max(100).optional(),
  agreed: z.literal(true, { message: 'Terms must be accepted' }),
});

export type BookingPayload = z.infer<typeof bookingSchema>;

export function generateBookingRef(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SBTK-${yy}${mm}${dd}-${rand}`;
}
