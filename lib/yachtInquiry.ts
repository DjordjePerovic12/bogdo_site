import { z } from 'zod';

export const DURATIONS = ['halfDay', 'fullDay', 'multiDay'] as const;

export const yachtInquirySchema = z.object({
  yachtSlug: z.string().min(1),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine((d) => new Date(d) >= new Date(new Date().toDateString()), 'Date cannot be in the past'),
  duration: z.enum(DURATIONS),
  guests: z.number().int().min(1).max(20),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Valid email required').max(254),
  phone: z.string().trim().min(5, 'Phone number required').max(30),
  notes: z.string().max(1000).optional(),
});

export type YachtInquiryPayload = z.infer<typeof yachtInquirySchema>;

export const DURATION_LABELS: Record<YachtInquiryPayload['duration'], string> = {
  halfDay: 'Half day',
  fullDay: 'Full day',
  multiDay: 'Several days',
};

export function generateInquiryRef(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return `AKUL-${yy}${mm}${dd}-${rand}`;
}
