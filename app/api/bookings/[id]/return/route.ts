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
      type: 'RETURN',
      staffName: body.staffName || auth.user?.name || 'Staff Member',
    });

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const lateFees = parseFloat(body.lateFees) || 0;
    const damageFees = parseFloat(body.damageFees) || 0;
    const vehicleStatus = body.vehicleStatusAfterReturn === 'UNDER_MAINTENANCE' ? 'UNDER_MAINTENANCE' : 'AVAILABLE';

    const inspection = InspectionService.createReturnInspection(
      {
        ...validation.data,
        vehicleId: booking.vehicleId,
      },
      lateFees,
      damageFees,
      vehicleStatus
    );

    // If damage was reported with charge, create damage report record
    if (damageFees > 0 || (body.newDamage && body.newDamage.trim() !== '')) {
      InspectionService.createDamageReport({
        bookingId: booking.id,
        vehicleId: booking.vehicleId,
        customerId: booking.customerId,
        damageType: body.damageType || 'COLLISION_OR_SCRATCH',
        description: body.newDamage || 'Reported upon vehicle return',
        severity: damageFees > 500 ? 'SEVERE' : (damageFees > 150 ? 'MODERATE' : 'MINOR'),
        estimatedCost: damageFees,
        finalCharge: damageFees,
        repairStatus: 'PENDING',
        responsibility: 'CUSTOMER',
        notes: body.damageNotes || '',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Vehicle returned successfully. Booking completed.',
      inspection,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Vehicle return failed' }, { status: 500 });
  }
}
