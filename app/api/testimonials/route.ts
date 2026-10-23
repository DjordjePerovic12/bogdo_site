import { NextRequest, NextResponse } from 'next/server';
import { addTestimonial, getApproved } from '@/lib/testimonials';
import { rateLimit } from '@/lib/rateLimit';

export async function GET() {
  const testimonials = getApproved();
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  if (!rateLimit(req, 'testimonials', 5, 60 * 60 * 1000)) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { name, text, rating } = await req.json();
    if (!name?.trim() || !text?.trim() || !rating) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Invalid rating' }, { status: 400 });
    }
    const trimmedName = name.trim().slice(0, 100);
    const trimmedText = text.trim().slice(0, 1000);
    addTestimonial(trimmedName, trimmedText, rating);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
