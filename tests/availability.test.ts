import { describe, it, expect } from 'vitest';
import { BookingService } from '../modules/booking/service';
import { dataStore } from '../lib/data-store';

describe('BookingService Availability & Collision Detection', () => {
  it('detects and rejects overlapping bookings for the same vehicle', () => {
    // We know veh-02 has active booking bk-01 from 2026-09-17 to 2026-09-22
    const checkOverlap = BookingService.isVehicleAvailable(
      'veh-02',
      '2026-09-18T10:00:00.000Z',
      '2026-09-20T10:00:00.000Z'
    );

    expect(checkOverlap.available).toBe(false);
    expect(checkOverlap.conflictReason).toContain('already reserved');
  });

  it('permits booking for the same vehicle when requested dates do not overlap', () => {
    // Dates way after the active booking ends
    const checkFuture = BookingService.isVehicleAvailable(
      'veh-02',
      '2026-10-10T10:00:00.000Z',
      '2026-10-15T10:00:00.000Z'
    );

    expect(checkFuture.available).toBe(true);
  });

  it('rejects booking if pickup date is after or equal to return date', () => {
    const invalidDates = BookingService.isVehicleAvailable(
      'veh-01',
      '2026-10-05T10:00:00.000Z',
      '2026-10-02T10:00:00.000Z'
    );

    expect(invalidDates.available).toBe(false);
    expect(invalidDates.conflictReason).toContain('Return date must be after pickup date');
  });

  it('allows booking a vehicle that has only a CANCELLED booking in that timeframe', () => {
    // veh-06 had a cancelled booking bk-07 in early September (2026-09-01 to 2026-09-03)
    const checkCancelled = BookingService.isVehicleAvailable(
      'veh-06',
      '2026-09-01T10:00:00.000Z',
      '2026-09-03T18:00:00.000Z'
    );

    // Cancelled bookings do not block availability
    expect(checkCancelled.available).toBe(true);
  });
});
