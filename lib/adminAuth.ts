import { createHmac, timingSafeEqual } from 'crypto';

export function deriveSessionToken(password: string): string {
  return createHmac('sha256', password).update('admin-session-v1').digest('hex');
}

export function verifySessionToken(token: string, password: string): boolean {
  if (!password) return false;
  const expected = deriveSessionToken(password);
  try {
    return timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}
