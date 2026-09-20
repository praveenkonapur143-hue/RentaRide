import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '@/modules/billing/service';
import { BookingService } from '@/modules/booking/service';
import { requireAuth } from '@/lib/api-auth';
import { validatePaymentInput } from '@/lib/validation/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const payments = BillingService.getAllPayments({ bookingId: params.id });
  return NextResponse.json({ payments });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF']);
  if (!auth.authorized) return auth.response;

  try {
    const booking = BookingService.getBookingById(params.id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const body = await req.json();
    const validation = validatePaymentInput({
      ...body,
      bookingId: booking.id,
    });

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const payment = BillingService.recordPayment({
      bookingId: booking.id,
      customerId: booking.customerId,
      amount: validation.data.amount,
      paymentMethod: validation.data.paymentMethod,
      transactionReference: body.transactionReference,
      notes: body.notes,
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Payment recording failed' }, { status: 500 });
  }
}
