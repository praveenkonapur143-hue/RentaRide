import { dataStore } from '@/lib/data-store';
import { DemoDamageReport, DemoInspection } from '@/lib/demo-data';
import { InspectionComparison, InspectionData } from './types';

export class InspectionService {
  static getInspections(bookingId?: string, vehicleId?: string): DemoInspection[] {
    return dataStore.getInspections({ bookingId, vehicleId });
  }

  static createCheckOutInspection(data: InspectionData): DemoInspection {
    const inspection = dataStore.createInspection({
      ...data,
      type: 'CHECK_OUT',
    });

    // Mark booking as ACTIVE_RENTAL and vehicle as RENTED
    dataStore.updateBooking(data.bookingId, { status: 'ACTIVE_RENTAL' });
    dataStore.updateVehicle(data.vehicleId, {
      status: 'RENTED',
      odometerReading: data.odometerReading,
    });

    dataStore.createAuditLog('CHECK_OUT_INSPECTION', 'INSPECTION', inspection.id, {
      bookingId: data.bookingId,
      odometer: data.odometerReading,
    });

    return inspection;
  }

  static createReturnInspection(
    data: InspectionData,
    lateFees: number = 0,
    damageFees: number = 0,
    vehicleStatusAfterReturn: 'AVAILABLE' | 'UNDER_MAINTENANCE' = 'AVAILABLE'
  ): DemoInspection {
    const inspection = dataStore.createInspection({
      ...data,
      type: 'RETURN',
    });

    // Update vehicle odometer and status
    dataStore.updateVehicle(data.vehicleId, {
      status: vehicleStatusAfterReturn,
      odometerReading: data.odometerReading,
    });

    // Update booking status to COMPLETED
    const booking = dataStore.getBookingById(data.bookingId);
    if (booking) {
      const additional = lateFees + damageFees;
      const newTotal = booking.totalAmount + additional;
      const newBalance = Math.max(0, newTotal - booking.advancePayment);
      dataStore.updateBooking(data.bookingId, {
        status: 'COMPLETED',
        actualReturnDate: new Date().toISOString(),
        totalAmount: newTotal,
        balanceAmount: newBalance,
      });

      // Update invoice
      const invoice = dataStore.getInvoiceByBookingId(data.bookingId);
      if (invoice) {
        invoice.lateFees += lateFees;
        invoice.damageFees += damageFees;
        invoice.totalAmount += additional;
        invoice.balanceDue += additional;
        invoice.status = invoice.balanceDue <= 0 ? 'PAID' : 'PARTIAL';
      }
    }

    dataStore.createAuditLog('RETURN_INSPECTION', 'INSPECTION', inspection.id, {
      bookingId: data.bookingId,
      lateFees,
      damageFees,
    });

    return inspection;
  }

  /**
   * Compares check-out and return inspections to detect odometer difference,
   * fuel deficit, late return hours, and damage changes.
   */
  static compareInspections(bookingId: string, returnOdo: number, returnFuelStr: string): InspectionComparison {
    const inspections = dataStore.getInspections({ bookingId });
    const checkOut = inspections.find(i => i.type === 'CHECK_OUT');
    const booking = dataStore.getBookingById(bookingId);
    const settings = dataStore.getSettings();

    const startOdo = checkOut ? checkOut.odometerReading : (booking ? 0 : 0);
    const odometerDiffKm = Math.max(0, returnOdo - startOdo);

    const fuelStart = checkOut ? checkOut.fuelLevel : '100%';
    const fuelEnd = returnFuelStr || '100%';

    const parsePct = (val: string) => {
      const num = parseInt(val.replace('%', ''));
      return isNaN(num) ? 100 : num;
    };

    const startPct = parsePct(fuelStart);
    const endPct = parsePct(fuelEnd);
    const fuelDeficitPct = Math.max(0, startPct - endPct);
    // Charge $1.50 per percent of missing fuel
    const fuelCharge = fuelDeficitPct > 0 ? Math.round(fuelDeficitPct * 1.5 * 100) / 100 : 0;

    // Late Return Calculation
    let lateHours = 0;
    let lateDays = 0;
    let lateCharge = 0;

    if (booking) {
      const scheduledReturn = new Date(booking.returnDate).getTime();
      const actualReturn = Date.now();
      const diffMs = actualReturn - scheduledReturn;

      if (diffMs > 1000 * 60 * 60) {
        // Late by more than 1 hour grace period
        lateHours = Math.ceil(diffMs / (1000 * 60 * 60));
        if (lateHours >= 24) {
          lateDays = Math.ceil(lateHours / 24);
          lateCharge = lateDays * settings.lateFeePerDay;
        } else {
          lateCharge = lateHours * settings.lateFeePerHour;
        }
      }
    }

    return {
      odometerDiffKm,
      fuelStart,
      fuelEnd,
      fuelDeficitPct,
      fuelCharge,
      lateHours,
      lateDays,
      lateCharge,
      hasNewDamage: false,
    };
  }

  // Damage Reports
  static getDamageReports(bookingId?: string, vehicleId?: string): DemoDamageReport[] {
    return dataStore.getDamageReports({ bookingId, vehicleId });
  }

  static createDamageReport(data: Partial<DemoDamageReport>): DemoDamageReport {
    return dataStore.createDamageReport(data);
  }
}
