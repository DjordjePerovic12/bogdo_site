import { NextRequest, NextResponse } from 'next/server';
import { yachtInquirySchema, generateInquiryRef } from '@/lib/yachtInquiry';
import { getYachtBySlug } from '@/lib/yachts';
import { sendYachtInquiryOwner, sendYachtInquiryCustomer, sendYachtInquiryMessages } from '@/lib/yachtNotify';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  if (!rateLimit(req, 'yacht-inquiry', 5, 60 * 60 * 1000)) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = yachtInquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const yacht = getYachtBySlug(data.yachtSlug);
    if (!yacht) {
      return NextResponse.json({ success: false, error: 'Yacht not found' }, { status: 400 });
    }
    if (data.guests > yacht.guests) {
      return NextResponse.json({ success: false, errors: { guests: [`Up to ${yacht.guests} guests`] } }, { status: 400 });
    }

    const ref = generateInquiryRef();
    const inquiry = { ...data, ref, yachtName: `${yacht.name} (${yacht.builder} ${yacht.model})` };

    const [owner, customer, messages] = await Promise.allSettled([
      sendYachtInquiryOwner(inquiry),
      sendYachtInquiryCustomer(inquiry),
      sendYachtInquiryMessages(inquiry),
    ]);
    if (customer.status === 'rejected') console.error('[yacht-inquiry] customer-email failed:', customer.reason);
    if (owner.status === 'rejected') console.error('[yacht-inquiry] owner-email failed:', owner.reason);
    if (messages.status === 'rejected') console.error('[yacht-inquiry] sms/whatsapp failed:', messages.reason);

    // If no owner channel got through, the lead would be lost; tell the visitor so they can use WhatsApp.
    if (owner.status === 'rejected' && messages.status === 'rejected') {
      return NextResponse.json({ success: false, error: 'Could not deliver inquiry' }, { status: 502 });
    }

    return NextResponse.json({ success: true, ref });
  } catch (err) {
    console.error('Yacht inquiry API error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
