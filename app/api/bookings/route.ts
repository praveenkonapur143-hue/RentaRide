import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from '@/modules/booking/service';
import { requireAuth } from '@/lib/api-auth';
import { validateBookingInput } from '@/lib/validation/schemas';
import { dataStore } from '@/lib/data-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const vehicleId = searchParams.get('vehicleId') || undefined;
  const customerId = searchParams.get('customerId') || undefined;
  const search = searchParams.get('search') || undefined;

  const bookings = BookingService.getAllBookings({ status, vehicleId, customerId, search });

  // Enrich with customer and vehicle minimal details for display
  const enriched = bookings.map(b => {
    const customer = dataStore.getCustomerById(b.customerId);
    const vehicle = dataStore.getVehicleById(b.vehicleId);
    return {
      ...b,
      customerName: customer?.fullName || 'Unknown Customer',
      customerPhone: customer?.phone || '',
      customerEmail: customer?.email || '',
      vehicleBrand: vehicle?.brand || '',
      vehicleModel: vehicle?.model || '',
      vehicleReg: vehicle?.registrationNumber || '',
      vehicleImage: vehicle?.images?.[0]?.url || '',
    };
  });

  return NextResponse.json({ bookings: enriched, count: enriched.length });
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF', 'CUSTOMER']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const validation = validateBookingInput(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const vehicle = dataStore.getVehicleById(body.vehicleId);
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const result = BookingService.createBooking({
      customerId: body.customerId,
      vehicleId: body.vehicleId,
      pickupLocation: body.pickupLocation || 'Downtown Hub',
      dropoffLocation: body.dropoffLocation || 'Downtown Hub',
      pickupDate: body.pickupDate,
      returnDate: body.returnDate,
      dailyRate: vehicle.dailyPrice,
      securityDeposit: vehicle.securityDeposit,
      discount: body.discount,
      taxRate: 10,
      advancePayment: body.advancePayment,
      notes: body.notes,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({ success: true, booking: result.booking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
  }
}
