import { NextRequest } from 'next/server';

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

export function rateLimit(req: NextRequest, key: string, max: number, windowMs: number): boolean {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown';
  const mapKey = `${key}:${ip}`;
  const now = Date.now();

  const entry = store.get(mapKey);
  if (!entry || now > entry.resetAt) {
    store.set(mapKey, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) return false;
  entry.count++;
  return true;
}
