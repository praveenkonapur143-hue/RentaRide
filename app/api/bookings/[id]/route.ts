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
  const auth = requireAuth(req, ['ADMIN', 'STAFF', 'CUSTOMER']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { action, reason, ...updates } = body;

    const booking = BookingService.getBookingById(params.id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Customer role security validation
    if (auth.user.role === 'CUSTOMER') {
      const customer = dataStore.getCustomerById(booking.customerId);
      const isOwner =
        booking.customerId === auth.user.id ||
        customer?.email?.toLowerCase() === auth.user.email?.toLowerCase() ||
        customer?.id === auth.user.id;

      if (!isOwner) {
        return NextResponse.json(
          { error: 'Forbidden: You are only authorized to manage your own bookings' },
          { status: 403 }
        );
      }

      if (action !== 'CANCEL') {
        return NextResponse.json(
          { error: 'Forbidden: Customers are only permitted to cancel reservations' },
          { status: 403 }
        );
      }

      if (booking.status === 'ACTIVE_RENTAL') {
        return NextResponse.json(
          { error: 'Cannot cancel trip: vehicle is currently out on rental. Please coordinate with fleet hub staff for early check-in.' },
          { status: 400 }
        );
      }

      if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
        return NextResponse.json(
          { error: `This trip is already ${booking.status.toLowerCase()}` },
          { status: 400 }
        );
      }
    }

    let updated = null;
    if (action === 'CANCEL') {
      updated = BookingService.cancelBooking(
        params.id,
        reason || (auth.user.role === 'CUSTOMER' ? 'Renter requested cancellation' : 'Staff cancelled booking')
      );
    } else if (action === 'CONFIRM') {
      updated = BookingService.confirmBooking(params.id);
    } else {
      updated = dataStore.updateBooking(params.id, updates);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Booking could not be updated' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      booking: updated,
      message: 'Booking cancelled successfully. Any advance payment will be credited back via original payment mode.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
