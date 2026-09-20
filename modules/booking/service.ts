import { dataStore } from '@/lib/data-store';
import { DemoBooking } from '@/lib/demo-data';
import {
  BookingCalculationParams,
  BookingCalculationResult,
  BookingFilterParams,
  BookingStatus
} from './types';

export class BookingService {
  /**
   * Pricing Engine: Calculates rental days, charges, taxes, discounts, and balances.
   */
  static calculatePricing(params: BookingCalculationParams): BookingCalculationResult {
    const pickup = new Date(params.pickupDate);
    const dropoff = new Date(params.returnDate);

    const diffMs = dropoff.getTime() - pickup.getTime();
    // Calculate days: 1 day minimum, rounded up for each started 24h period
    const rawDays = diffMs / (1000 * 60 * 60 * 24);
    const days = Math.max(1, Math.ceil(rawDays));

    const dailyRate = Math.max(0, params.dailyRate);
    const subtotal = Math.round(dailyRate * days * 100) / 100;

    const discount = Math.min(subtotal, Math.max(0, params.discount || 0));
    const taxableAmount = Math.max(0, subtotal - discount);

    const taxRate = params.taxRate !== undefined ? params.taxRate : 18;
    const taxAmount = Math.round(taxableAmount * (taxRate / 100) * 100) / 100;

    const totalAmount = Math.round((taxableAmount + taxAmount) * 100) / 100;
    const advancePayment = Math.min(totalAmount, Math.max(0, params.advancePayment || 0));
    const balanceAmount = Math.round((totalAmount - advancePayment) * 100) / 100;
    const securityDeposit = Math.max(0, params.securityDeposit !== undefined ? params.securityDeposit : 3000);

    return {
      days,
      subtotal,
      discount,
      taxAmount,
      taxRate,
      totalAmount,
      advancePayment,
      balanceAmount,
      securityDeposit,
    };
  }

  /**
   * Double-booking Prevention Algorithm:
   * Returns true if vehicle has no conflicting CONFIRMED or ACTIVE_RENTAL bookings in given range.
   */
  static isVehicleAvailable(
    vehicleId: string,
    pickupDate: string | Date,
    returnDate: string | Date,
    excludeBookingId?: string
  ): { available: boolean; conflictReason?: string } {
    const reqStart = new Date(pickupDate).getTime();
    const reqEnd = new Date(returnDate).getTime();

    if (isNaN(reqStart) || isNaN(reqEnd)) {
      return { available: false, conflictReason: 'Invalid pickup or return date' };
    }
    if (reqEnd <= reqStart) {
      return { available: false, conflictReason: 'Return date must be after pickup date' };
    }

    const vehicle = dataStore.getVehicleById(vehicleId);
    if (!vehicle) {
      return { available: false, conflictReason: 'Vehicle not found' };
    }
    if (vehicle.isArchived || vehicle.status === 'UNDER_MAINTENANCE') {
      return { available: false, conflictReason: `Vehicle is currently ${vehicle.status.toLowerCase().replace('_', ' ')}` };
    }

    const check = dataStore.checkVehicleAvailability(
      vehicleId,
      new Date(pickupDate).toISOString(),
      new Date(returnDate).toISOString(),
      excludeBookingId
    );

    if (!check.available && check.conflict) {
      return {
        available: false,
        conflictReason: `Vehicle is already reserved under booking ${check.conflict.bookingNumber} (${new Date(check.conflict.pickupDate).toLocaleDateString()} to ${new Date(check.conflict.returnDate).toLocaleDateString()})`,
      };
    }

    return { available: true };
  }

  static getAllBookings(filters?: BookingFilterParams): DemoBooking[] {
    return dataStore.getBookings(filters);
  }

  static getBookingById(id: string): DemoBooking | undefined {
    return dataStore.getBookingById(id);
  }

  static createBooking(data: {
    customerId: string;
    vehicleId: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    returnDate: string;
    dailyRate: number;
    securityDeposit?: number;
    discount?: number;
    taxRate?: number;
    advancePayment?: number;
    notes?: string;
  }): { success: boolean; booking?: DemoBooking; error?: string } {
    // 1. Availability validation
    const availability = this.isVehicleAvailable(data.vehicleId, data.pickupDate, data.returnDate);
    if (!availability.available) {
      return { success: false, error: availability.conflictReason };
    }

    // 2. Pricing Engine
    const pricing = this.calculatePricing({
      dailyRate: data.dailyRate,
      pickupDate: data.pickupDate,
      returnDate: data.returnDate,
      discount: data.discount,
      taxRate: data.taxRate,
      securityDeposit: data.securityDeposit,
      advancePayment: data.advancePayment,
    });

    // 3. Create Booking
    const booking = dataStore.createBooking({
      customerId: data.customerId,
      vehicleId: data.vehicleId,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      pickupDate: new Date(data.pickupDate).toISOString(),
      returnDate: new Date(data.returnDate).toISOString(),
      dailyRate: data.dailyRate,
      days: pricing.days,
      securityDeposit: pricing.securityDeposit,
      discount: pricing.discount,
      taxRate: pricing.taxRate,
      taxAmount: pricing.taxAmount,
      totalAmount: pricing.totalAmount,
      advancePayment: pricing.advancePayment,
      balanceAmount: pricing.balanceAmount,
      status: 'CONFIRMED',
      notes: data.notes || '',
    });

    dataStore.createAuditLog('CREATE_BOOKING', 'BOOKING', booking.id, { bookingNumber: booking.bookingNumber });

    return { success: true, booking };
  }

  static confirmBooking(id: string): DemoBooking | null {
    const booking = dataStore.getBookingById(id);
    if (!booking) return null;
    const updated = dataStore.updateBooking(id, { status: 'CONFIRMED' });
    dataStore.updateVehicle(booking.vehicleId, { status: 'BOOKED' });
    dataStore.createAuditLog('CONFIRM_BOOKING', 'BOOKING', id);
    return updated;
  }

  static checkOut(id: string): DemoBooking | null {
    const booking = dataStore.getBookingById(id);
    if (!booking) return null;
    const updated = dataStore.updateBooking(id, { status: 'ACTIVE_RENTAL' });
    dataStore.updateVehicle(booking.vehicleId, { status: 'RENTED' });
    dataStore.createAuditLog('CHECK_OUT_BOOKING', 'BOOKING', id);
    return updated;
  }

  static returnVehicle(
    id: string,
    lateFees: number = 0,
    damageFees: number = 0,
    vehicleStatusAfterReturn: 'AVAILABLE' | 'UNDER_MAINTENANCE' = 'AVAILABLE'
  ): DemoBooking | null {
    const booking = dataStore.getBookingById(id);
    if (!booking) return null;

    const actualReturnDate = new Date().toISOString();
    const additionalCharges = lateFees + damageFees;
    const newTotal = booking.totalAmount + additionalCharges;
    const newBalance = Math.max(0, newTotal - booking.advancePayment);

    const updated = dataStore.updateBooking(id, {
      status: 'COMPLETED',
      actualReturnDate,
      totalAmount: newTotal,
      balanceAmount: newBalance,
    });

    // Update invoice with late/damage charges
    const invoice = dataStore.getInvoiceByBookingId(id);
    if (invoice) {
      invoice.lateFees += lateFees;
      invoice.damageFees += damageFees;
      invoice.totalAmount += additionalCharges;
      invoice.balanceDue += additionalCharges;
      invoice.status = invoice.balanceDue <= 0 ? 'PAID' : 'PARTIAL';
    }

    // Update vehicle status
    dataStore.updateVehicle(booking.vehicleId, { status: vehicleStatusAfterReturn });

    dataStore.createAuditLog('RETURN_VEHICLE', 'BOOKING', id, { lateFees, damageFees, vehicleStatus: vehicleStatusAfterReturn });

    return updated;
  }

  static cancelBooking(id: string, reason: string): DemoBooking | null {
    const booking = dataStore.getBookingById(id);
    if (!booking) return null;

    const updated = dataStore.updateBooking(id, {
      status: 'CANCELLED',
      cancellationReason: reason,
      cancelledAt: new Date().toISOString(),
    });

    // Release vehicle back to AVAILABLE
    dataStore.updateVehicle(booking.vehicleId, { status: 'AVAILABLE' });

    dataStore.createAuditLog('CANCEL_BOOKING', 'BOOKING', id, { reason });

    return updated;
  }
}
