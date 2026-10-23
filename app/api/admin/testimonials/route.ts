import { NextRequest, NextResponse } from 'next/server';
import { readAll, approveTestimonial, deleteTestimonial } from '@/lib/testimonials';
import { verifySessionToken } from '@/lib/adminAuth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

function checkAuth(req: NextRequest): boolean {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return false;
  return verifySessionToken(token, ADMIN_PASSWORD);
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ testimonials: readAll() });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, action } = await req.json();
  if (!id || !action) return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });

  if (action === 'approve') {
    const ok = approveTestimonial(id);
    return NextResponse.json({ success: ok });
  }
  if (action === 'delete') {
    const ok = deleteTestimonial(id);
    return NextResponse.json({ success: ok });
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
