import { describe, it, expect } from 'vitest';
import { BookingService } from '../modules/booking/service';

describe('BookingService.calculatePricing', () => {
  it('calculates duration, subtotal, and tax correctly for standard rental', () => {
    const pricing = BookingService.calculatePricing({
      dailyRate: 100,
      pickupDate: '2026-10-01T10:00:00.000Z',
      returnDate: '2026-10-04T10:00:00.000Z', // exactly 3 days
      taxRate: 10,
      securityDeposit: 300,
      advancePayment: 100,
    });

    expect(pricing.days).toBe(3);
    expect(pricing.subtotal).toBe(300);
    expect(pricing.taxAmount).toBe(30);
    expect(pricing.totalAmount).toBe(330);
    expect(pricing.advancePayment).toBe(100);
    expect(pricing.balanceAmount).toBe(230);
    expect(pricing.securityDeposit).toBe(300);
  });

  it('enforces minimum 1 day rental even if dates are within the same day', () => {
    const pricing = BookingService.calculatePricing({
      dailyRate: 65,
      pickupDate: '2026-10-01T09:00:00.000Z',
      returnDate: '2026-10-01T17:00:00.000Z', // 8 hours
      taxRate: 10,
    });

    expect(pricing.days).toBe(1);
    expect(pricing.subtotal).toBe(65);
    expect(pricing.taxAmount).toBe(6.5);
    expect(pricing.totalAmount).toBe(71.5);
  });

  it('correctly applies discounts before computing taxes', () => {
    const pricing = BookingService.calculatePricing({
      dailyRate: 100,
      pickupDate: '2026-10-01T10:00:00.000Z',
      returnDate: '2026-10-03T10:00:00.000Z', // 2 days -> $200
      discount: 50,
      taxRate: 10, // 10% on (200 - 50) = $15
      advancePayment: 0,
    });

    expect(pricing.days).toBe(2);
    expect(pricing.subtotal).toBe(200);
    expect(pricing.discount).toBe(50);
    expect(pricing.taxAmount).toBe(15);
    expect(pricing.totalAmount).toBe(165);
    expect(pricing.balanceAmount).toBe(165);
  });

  it('caps advance payments at total amount so balance cannot be negative', () => {
    const pricing = BookingService.calculatePricing({
      dailyRate: 50,
      pickupDate: '2026-10-01T10:00:00.000Z',
      returnDate: '2026-10-02T10:00:00.000Z', // 1 day -> $50
      taxRate: 10, // $5 -> total $55
      advancePayment: 100, // overpaid
    });

    expect(pricing.totalAmount).toBe(55);
    expect(pricing.advancePayment).toBe(55);
    expect(pricing.balanceAmount).toBe(0);
  });

  it('calculates Indian GST 18% (9% CGST + 9% SGST) and security deposit for Thar 4x4', () => {
    // Mahindra Thar 4x4 at ₹3,200/day for 3 days
    const pricing = BookingService.calculatePricing({
      dailyRate: 3200,
      pickupDate: '2026-10-01T10:00:00.000Z',
      returnDate: '2026-10-04T10:00:00.000Z', // 3 days -> ₹9,600
      taxRate: 18, // 18% GST -> ₹1,728
      securityDeposit: 3000,
      advancePayment: 5000,
    });

    expect(pricing.days).toBe(3);
    expect(pricing.subtotal).toBe(9600);
    expect(pricing.taxAmount).toBe(1728);
    expect(pricing.totalAmount).toBe(11328); // 9600 + 1728
    expect(pricing.securityDeposit).toBe(3000);
    expect(pricing.advancePayment).toBe(5000);
    expect(pricing.balanceAmount).toBe(6328); // 11328 - 5000
  });
});
