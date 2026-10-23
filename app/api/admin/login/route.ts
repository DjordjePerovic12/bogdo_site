import { NextRequest, NextResponse } from 'next/server';
import { deriveSessionToken } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  if (!rateLimit(req, 'admin-login', 5, 15 * 60 * 1000)) {
    return NextResponse.json({ success: false }, { status: 429 });
  }

  const { password } = await req.json();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const sessionToken = deriveSessionToken(ADMIN_PASSWORD);
  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_token', sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
