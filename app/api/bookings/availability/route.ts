import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from '@/modules/booking/service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vehicleId = searchParams.get('vehicleId');
  const pickupDate = searchParams.get('pickupDate');
  const returnDate = searchParams.get('returnDate');
  const excludeBookingId = searchParams.get('excludeBookingId') || undefined;

  if (!vehicleId || !pickupDate || !returnDate) {
    return NextResponse.json(
      { error: 'vehicleId, pickupDate, and returnDate are required query parameters' },
      { status: 400 }
    );
  }

  const result = BookingService.isVehicleAvailable(vehicleId, pickupDate, returnDate, excludeBookingId);
  return NextResponse.json(result);
}
