import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '@/modules/billing/service';
import { BookingService } from '@/modules/booking/service';
import { dataStore } from '@/lib/data-store';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const booking = BookingService.getBookingById(params.id);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const invoice = BillingService.getInvoiceByBookingId(booking.id);
  const customer = dataStore.getCustomerById(booking.customerId);
  const vehicle = dataStore.getVehicleById(booking.vehicleId);
  const payments = BillingService.getAllPayments({ bookingId: booking.id });
  const settings = dataStore.getSettings();

  return NextResponse.json({
    invoice,
    booking,
    customer,
    vehicle,
    payments,
    settings,
  });
}
