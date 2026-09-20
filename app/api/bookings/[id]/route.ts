import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from '@/modules/booking/service';
import { dataStore } from '@/lib/data-store';
import { requireAuth } from '@/lib/api-auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const booking = BookingService.getBookingById(params.id);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const customer = dataStore.getCustomerById(booking.customerId);
  const vehicle = dataStore.getVehicleById(booking.vehicleId);
  const invoice = dataStore.getInvoiceByBookingId(booking.id);
  const payments = dataStore.getPayments({ bookingId: booking.id });
  const inspections = dataStore.getInspections({ bookingId: booking.id });
  const damageReports = dataStore.getDamageReports({ bookingId: booking.id });
  const settings = dataStore.getSettings();

  return NextResponse.json({
    booking,
    customer,
    vehicle,
    invoice,
    payments,
    inspections,
    damageReports,
    settings,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { action, reason, ...updates } = body;

    let updated = null;
    if (action === 'CANCEL') {
      updated = BookingService.cancelBooking(params.id, reason || 'Customer requested cancellation');
    } else if (action === 'CONFIRM') {
      updated = BookingService.confirmBooking(params.id);
    } else {
      updated = dataStore.updateBooking(params.id, updates);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
