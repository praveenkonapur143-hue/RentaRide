import { NextRequest, NextResponse } from 'next/server';
import { InspectionService } from '@/modules/inspection/service';
import { BookingService } from '@/modules/booking/service';
import { requireAuth } from '@/lib/api-auth';
import { validateInspectionInput } from '@/lib/validation/schemas';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF']);
  if (!auth.authorized) return auth.response;

  try {
    const booking = BookingService.getBookingById(params.id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const body = await req.json();
    const validation = validateInspectionInput({
      ...body,
      bookingId: booking.id,
      type: 'CHECK_OUT',
      staffName: body.staffName || auth.user?.name || 'Staff Member',
    });

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const inspection = InspectionService.createCheckOutInspection({
      ...validation.data,
      vehicleId: booking.vehicleId,
    });

    return NextResponse.json({
      success: true,
      message: 'Check-out completed. Vehicle is now on active rental.',
      inspection,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Check-out failed' }, { status: 500 });
  }
}
