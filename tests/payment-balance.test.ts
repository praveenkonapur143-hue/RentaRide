import { describe, it, expect } from 'vitest';
import { BillingService } from '../modules/billing/service';
import { BookingService } from '../modules/booking/service';
import { dataStore } from '../lib/data-store';

describe('BillingService & Balance Calculations', () => {
  it('correctly updates invoice and booking balance after a partial payment', () => {
    // Create a new fresh booking
    const bookingRes = BookingService.createBooking({
      customerId: 'cust-01',
      vehicleId: 'veh-01',
      pickupLocation: 'Downtown Hub',
      dropoffLocation: 'Downtown Hub',
      pickupDate: '2026-11-01T10:00:00.000Z',
      returnDate: '2026-11-03T10:00:00.000Z', // 2 days -> $130 + 10% tax = $143
      dailyRate: 65,
      taxRate: 10,
      advancePayment: 43,
    });

    expect(bookingRes.success).toBe(true);
    const booking = bookingRes.booking!;
    expect(booking.totalAmount).toBe(143);
    expect(booking.balanceAmount).toBe(100);

    // Now make another partial payment of $60
    const payment = BillingService.recordPayment({
      bookingId: booking.id,
      customerId: booking.customerId,
      amount: 60,
      paymentMethod: 'CARD',
      transactionReference: 'TEST-TXN-PARTIAL',
    });

    expect(payment.amount).toBe(60);

    // Refresh booking and check invoice
    const updatedBooking = BookingService.getBookingById(booking.id)!;
    expect(updatedBooking.advancePayment).toBe(103);
    expect(updatedBooking.balanceAmount).toBe(40);

    const invoice = BillingService.getInvoiceByBookingId(booking.id)!;
    expect(invoice.paidAmount).toBe(103);
    expect(invoice.balanceDue).toBe(40);
    expect(invoice.status).toBe('PARTIAL');
  });

  it('correctly updates total and balance when late return and damage fees are added', () => {
    // Create booking with $100 total, $100 paid
    const bookingRes = BookingService.createBooking({
      customerId: 'cust-02',
      vehicleId: 'veh-04',
      pickupLocation: 'Downtown Hub',
      dropoffLocation: 'Downtown Hub',
      pickupDate: '2026-11-10T10:00:00.000Z',
      returnDate: '2026-11-11T10:00:00.000Z',
      dailyRate: 100,
      taxRate: 0,
      advancePayment: 100,
    });

    const booking = bookingRes.booking!;
    expect(booking.balanceAmount).toBe(0);

    // Return with late fee $50 and damage fee $150
    const returned = BookingService.returnVehicle(booking.id, 50, 150, 'AVAILABLE')!;
    expect(returned.totalAmount).toBe(300); // 100 + 200
    expect(returned.balanceAmount).toBe(200); // 300 - 100

    const invoice = BillingService.getInvoiceByBookingId(booking.id)!;
    expect(invoice.lateFees).toBe(50);
    expect(invoice.damageFees).toBe(150);
    expect(invoice.totalAmount).toBe(300);
    expect(invoice.balanceDue).toBe(200);
  });
});
