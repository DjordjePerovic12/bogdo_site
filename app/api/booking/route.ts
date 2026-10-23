import { NextRequest, NextResponse } from 'next/server';
import { bookingSchema, generateBookingRef } from '@/lib/booking';
import { getTourBySlug } from '@/lib/tours';
import { sendCustomerConfirmation, sendOwnerNotification } from '@/lib/email';
import { sendOwnerSMS } from '@/lib/sms';
import { sendOwnerWhatsApp } from '@/lib/whatsapp';
import { rateLimit } from '@/lib/rateLimit';
import { addReferral } from '@/lib/referrals';

export async function POST(req: NextRequest) {
  if (!rateLimit(req, 'booking', 5, 60 * 60 * 1000)) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const tour = getTourBySlug(data.tourSlug);

    if (!tour) {
      return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 400 });
    }

    const bookingRef = generateBookingRef();

    if (data.referralSource) {
      const totalPrice = tour.type === 'group'
        ? tour.basePrice * data.guests
        : tour.basePrice;
      addReferral({
        bookingRef,
        tourSlug: tour.slug,
        tourName: tour.name,
        tourType: tour.type,
        guests: data.guests,
        totalPrice,
        referralSource: data.referralSource,
        tourDate: data.date,
      });
    }

    const emailData = { ...data, bookingRef, tourName: tour.name };
    const notifData = {
      tourName: tour.name,
      date: data.date,
      time: data.time,
      guests: data.guests,
      name: data.name,
      phone: data.phone,
      bookingRef,
      referralSource: data.referralSource,
    };

    const results = await Promise.allSettled([
      sendCustomerConfirmation(emailData),
      sendOwnerNotification(emailData),
      sendOwnerSMS(notifData),
      sendOwnerWhatsApp(notifData),
    ]);
    const labels = ['customer-email', 'owner-email', 'sms', 'whatsapp'];
    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`[booking] ${labels[i]} failed:`, r.reason);
    });

    return NextResponse.json({ success: true, bookingRef });
  } catch (err) {
    console.error('Booking API error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
